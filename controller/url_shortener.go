package controller

import (
	"net/http"

	"github.com/Endesapt/url_shortener_go/models"
	"github.com/gin-gonic/gin"
)

// @Summary      shorten URL
// @Description  shortens your  URL to small format for you to use it
// @Tags         shortenURL
// @Accept       json
// @Produce      json
// @Param        url    query     string  true "Shorten URL"
// @Success      200  {object}  models.UrlShortenResponse
// @Failure      400  {object}  httputil.HTTPError
// @Failure      404  {object}  httputil.HTTPError
// @Router       /shortenURL [post]
func (c *Controller) ShortenUrl(ctx *gin.Context) {
	Url := ctx.Request.URL.Query().Get("url")
	resultUrl := models.UrlShortenResponse{
		ShortURL: Url + "NEGRITOSIKI",
	}
	ctx.JSON(http.StatusOK, resultUrl)
}
