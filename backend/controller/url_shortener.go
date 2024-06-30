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
// @Success      200  {object}  models.UrlShortenResponse
// @Failure      400  {object}  httputil.HTTPError
// @Failure      404  {object}  httputil.HTTPError
// @Router       /api/v1/shortenURL [post]
func (c *Controller) ShortenUrl(ctx *gin.Context) {
	url := ctx.Request.URL.Query().Get("url")
	resultUrl := models.UrlShortenResponse{}

	id := GenerateRandString(10)

	if userId, err := GetUserId(ctx); err == nil {
		c.RedisClient.SAdd(ctx.Request.Context(), "links:"+userId, id)
		c.RedisClient.HSet(ctx.Request.Context(), id, "issuerID", userId)
	}

	err := c.RedisClient.HSet(ctx.Request.Context(), id, "originalUrl", url).Err()
	if err != nil {
		panic(err)
	}
	err = c.RedisClient.HSet(ctx.Request.Context(), id, "count", 0).Err()
	if err != nil {
		panic(err)
	}

	scheme := "http"
	if ctx.Request.TLS != nil {
		scheme = "https"
	}

	newLink := fmt.Sprintf("%s://%s/link/%s", scheme, ctx.Request.Host, id)
	resultUrl.ShortURL = newLink
	ctx.JSON(http.StatusOK, resultUrl)
}

// @Summary      Info about shorten URL
// @Description  Get info about how many times and what IPs where entering your site
// @Tags         ShortenURL
// @Accept       json
// @Produce      json
// @Param        id    path     string  true "id"
// @Success      200  {object}  models.UrlInfoResponse
// @Failure      400  {object}  httputil.HTTPError
// @Router       /api/v1/getInfo/{id} [get]
func (c *Controller) GetInfo(ctx *gin.Context) {
	id := ctx.Param("id")
	var (
		urlInfo models.UrlInfoResponse
	)
	if err := c.RedisClient.HMGet(ctx.Request.Context(), id, "count", "originalUrl", "issuerID").Scan(&urlInfo); err != nil {
		panic(err)
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
// @Router       /link/{id} [get]
func (c *Controller) RedirectURL(ctx *gin.Context) {
	id := ctx.Param("id")
	url, err := c.RedisClient.HGet(ctx.Request.Context(), id, "originalUrl").Result()
	if err == redis.Nil {
		httputil.NewError(ctx, http.StatusBadRequest, errors.New("There is no such short url!"))
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
// @Success      200  {array} string
// @Failure      403  {object}  httputil.HTTPError
// @Router       /api/v1/getLinks [get]
func (c *Controller) GetLinks(ctx *gin.Context) {
	userId, idErr := GetUserId(ctx)
	if idErr != nil {
		httputil.NewError(ctx, http.StatusForbidden, idErr)
	}
	values, err := c.RedisClient.SMembers(ctx.Request.Context(), "links:"+userId).Result()
	if err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusOK, values)
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

func GetUserId(ctx *gin.Context) (string, error) {
	userIdToken, err := ctx.Request.Cookie("IDtoken")
	if err == nil {
		accessToken := userIdToken.Value
		payload, err := idtoken.Validate(ctx.Request.Context(), accessToken, os.Getenv("AUTH_CLIENT_ID"))
		if err == nil {
			return payload.Subject, nil
		}
	}
	return "", err
}
