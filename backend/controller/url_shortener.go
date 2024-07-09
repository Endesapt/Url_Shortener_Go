package controller

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"os"

	"github.com/Endesapt/url_shortener_go/httputil"
	"github.com/redis/go-redis/v9"
	idtoken "google.golang.org/api/idtoken"

	"github.com/Endesapt/url_shortener_go/models"
	"github.com/gin-gonic/gin"
)

// @Summary      Shorten URL
// @Description  Shortens your  URL to small format for you to use it
// @Tags         ShortenURL
// @Accept       json
// @Produce      json
// @Param        url    query     string  true "Shorten URL"
// @Param 	     id_token 	body 	string 	false 	"id_token"
// @Success      200  {object}  models.UrlShortenResponse
// @Failure      400  {object}  httputil.HTTPError
// @Failure      404  {object}  httputil.HTTPError
// @Router       /shortenURL [post]
func (c *Controller) ShortenUrl(ctx *gin.Context) {
	url := ctx.Request.URL.Query().Get("url")
	resultUrl := models.UrlShortenResponse{}

	id := GenerateRandString(10)

	if userId, userEmail, err := GetUserId(ctx); err == nil {
		c.RedisClient.SAdd(ctx.Request.Context(), "links:"+userId, id)
		c.RedisClient.HMSet(ctx.Request.Context(), id, "issuerEmail", userEmail, "issuerId", userId)
	}

	err := c.RedisClient.HMSet(ctx.Request.Context(), id, "originalUrl", url, "count", 0).Err()
	if err != nil {
		panic(err)
	}

	scheme := "http"
	if ctx.Request.TLS != nil {
		scheme = "https"
	}

	newLink := fmt.Sprintf("%s://%s/api/%s", scheme, ctx.Request.Host, id)
	resultUrl.ShortURL = newLink
	ctx.JSON(http.StatusOK, resultUrl)
}

// @Summary      Info about shorten URL
// @Description  Get info about how many times and what IPs where entering your site
// @Tags         URL Info/Edit
// @Accept       json
// @Produce      json
// @Param        id    path     string  true "id"
// @Success      200  {object}  models.UrlInfoResponse
// @Failure      400  {object}  httputil.HTTPError
// @Router       /getInfo/{id} [get]
func (c *Controller) GetInfo(ctx *gin.Context) {
	id := ctx.Param("id")
	var (
		urlInfo models.UrlInfoResponse
	)
	if err := c.RedisClient.HMGet(ctx.Request.Context(), id, "count", "originalUrl", "issuerEmail").Scan(&urlInfo); err != nil {
		panic(err)
	}
	if urlInfo.OriginalUrl == "" {
		httputil.NewError(ctx, http.StatusBadRequest, errors.New("this short url does not exist"))
	}
	ips, err := c.RedisClient.SMembers(ctx.Request.Context(), id+":ips").Result()
	if err != nil {
		panic(err)
	}

	urlInfo.IPs = ips
	ctx.JSON(http.StatusOK, urlInfo)

}

// @Summary      Redirect to link
// @Description  Redirects to link that you have enetered on shortenURL path
// @Tags         ShortenURL
// @Accept       json
// @Produce      json
// @Param        id    path     string  true "id"
// @Success      302
// @Failure      400  {object}  httputil.HTTPError
// @Router       /{id} [get]
func (c *Controller) RedirectURL(ctx *gin.Context) {
	id := ctx.Param("id")
	url, err := c.RedisClient.HGet(ctx.Request.Context(), id, "originalUrl").Result()
	if err == redis.Nil {
		httputil.NewError(ctx, http.StatusBadRequest, errors.New("there is no such short url"))
		return
	} else if err != nil {
		panic(err)
	}
	err = c.RedisClient.SAdd(ctx.Request.Context(), id+":ips", ctx.RemoteIP()).Err()
	if err != nil {
		panic(err)
	}
	err = c.RedisClient.HIncrBy(ctx.Request.Context(), id, "count", 1).Err()
	if err != nil {
		panic(err)
	}

	ctx.Redirect(http.StatusPermanentRedirect, url)

}

// @Summary      Get all links
// @Description  Get all links that associated your account if you are registered
// @Tags         ShortenURL
// @Accept       json
// @Produce      json
// @Param 	     id_token 	query 	string 	true 	"id_token"
// @Success      200  {array} string
// @Failure      403  {object}  httputil.HTTPError
// @Router       /getLinks [get]
func (c *Controller) GetLinks(ctx *gin.Context) {
	userId, _, idErr := GetUserId(ctx)
	if idErr != nil {
		httputil.NewError(ctx, http.StatusForbidden, idErr)
		return
	}
	values, err := c.RedisClient.SMembers(ctx.Request.Context(), "links:"+userId).Result()
	if err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusOK, values)
}

// @Summary      Delete link with id
// @Description  Delete link with id in case you are the owner of the link
// @Tags         URL Info/Edit
// @Accept       json
// @Produce      json
// @Param        id    path     string  true "id"
// @Param 	     id_token 	body 	string 	true 	"id_token"
// @Success      200
// @Failure      400  {object}  httputil.HTTPError
// @Failure      403  {object}  httputil.HTTPError
// @Router       /deleteURL/{id} [delete]
func (c *Controller) DeleteURL(ctx *gin.Context) {
	userId, _, idErr := GetUserId(ctx)
	if idErr != nil {
		httputil.NewError(ctx, http.StatusForbidden, idErr)
		return
	}
	id := ctx.Param("id")

	linkIssuer, err := c.RedisClient.HGet(ctx, id, "issuerId").Result()
	if err != nil {
		httputil.NewError(ctx, http.StatusBadRequest, err)
		return
	}
	if linkIssuer != userId {
		httputil.NewError(ctx, http.StatusForbidden, errors.New("you cannot change this link"))
		return
	}

	_, err = c.RedisClient.Pipelined(ctx, func(pipe redis.Pipeliner) error {
		err = c.RedisClient.Del(ctx, id).Err()
		if err != nil {
			return err
		}
		err = c.RedisClient.SRem(ctx, "links:"+userId, id).Err()
		return err
	})
	if err != nil {
		httputil.NewError(ctx, http.StatusBadRequest, err)
		return
	}

	ctx.JSON(http.StatusOK, nil)

}

// @Summary      Edit link with id
// @Description  Edit link with id in case you are the owner of the link
// @Tags         URL Info/Edit
// @Accept       json
// @Produce      json
// @Param        id    path     string  true "id"
// @Param 	     id_token 	body 	string 	true 	"id_token"
// @Param		 linkInfo body  models.UrlEdit true "Edit Info"
// @Success      200  {object}  models.UrlEdit
// @Failure      400  {object}  httputil.HTTPError
// @Failure      403  {object}  httputil.HTTPError
// @Router       /editURL/{id} [patch]
func (c *Controller) EditURL(ctx *gin.Context) {
	userId, _, idErr := GetUserId(ctx)
	if idErr != nil {
		httputil.NewError(ctx, http.StatusForbidden, idErr)
		return
	}
	id := ctx.Param("id")
	var data models.UrlEdit
	err := ctx.ShouldBindBodyWithJSON(&data)
	if err != nil {
		httputil.NewError(ctx, http.StatusBadRequest, err)
		return
	}
	linkIssuer, err := c.RedisClient.HGet(ctx, id, "issuerId").Result()
	if err != nil {
		httputil.NewError(ctx, http.StatusBadRequest, err)
		return
	}
	if linkIssuer != userId {
		httputil.NewError(ctx, http.StatusForbidden, errors.New("you cannot change this link"))
		return
	}
	if data.ShortUrl != id {
		err = c.RedisClient.Get(ctx, data.ShortUrl).Err()
		if err != redis.Nil {

			httputil.NewError(ctx, http.StatusForbidden, errors.New("there is already short URL with this name"))
			return
		}
		c.RedisClient.Rename(ctx, id, data.ShortUrl)
	}
	c.RedisClient.HSet(ctx, data.ShortUrl, "originalUrl", data.OriginalUrl)

	ctx.JSON(http.StatusAccepted, data)

}

func GenerateRandString(n int) string {

	// Define the character set
	charSet := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

	randomSequence := make([]byte, n)
	for i := range randomSequence {
		randomSequence[i] = charSet[rand.Intn(len(charSet))]
	}

	return string(randomSequence)
}

func GetUserId(ctx *gin.Context) (string, string, error) {
	var data struct {
		IdToken string `json:"id_token" binding:"required"`
	}
	err := ctx.ShouldBindBodyWithJSON(&data)
	if err != nil {
		idToken, has := ctx.GetQuery("id_token")
		if !has {
			return "", "", err
		}
		data.IdToken = idToken
	}

	payload, err := idtoken.Validate(ctx.Request.Context(), data.IdToken, os.Getenv("AUTH_CLIENT_ID"))
	if err == nil {
		return payload.Subject, payload.Claims["email"].(string), nil
	}
	return "", "", err

}
