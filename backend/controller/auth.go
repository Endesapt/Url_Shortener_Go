package controller

import (
	"net/http"

	"github.com/Endesapt/url_shortener_go/httputil"
	"github.com/gin-gonic/gin"
	"github.com/markbates/goth/gothic"
)

// @Summary      Login
// @Tags         Auth
// @Router       /auth/login [get]
func (c *Controller) Login(ctx *gin.Context) {
	q := ctx.Request.URL.Query()
	q.Add("provider", "google")
	ctx.Request.URL.RawQuery = q.Encode()

	if gothicUser, err := gothic.CompleteUserAuth(ctx.Writer, ctx.Request); err == nil {
		ctx.JSON(http.StatusOK, gothicUser)
	} else {
		gothic.BeginAuthHandler(ctx.Writer, ctx.Request)
	}
}

// @Summary      Callback to page
// @Description  Redirects to / page with your credentials
// @Tags         Auth
// @Router       /auth/callback [get]
func (c *Controller) Callback(ctx *gin.Context) {
	q := ctx.Request.URL.Query()
	q.Add("provider", "google")
	ctx.Request.URL.RawQuery = q.Encode()

	user, err := gothic.CompleteUserAuth(ctx.Writer, ctx.Request)
	if err != nil {
		httputil.NewError(ctx, http.StatusFound, err)
		return
	}
	ID_cookie := http.Cookie{
		Name:     "IDtoken",
		Path:     "/",
		Value:    user.IDToken,
		Expires:  user.ExpiresAt,
		SameSite: http.SameSiteDefaultMode,
		HttpOnly: true,
	}
	http.SetCookie(ctx.Writer, &ID_cookie)

	ctx.JSON(http.StatusOK, user)
}

// @Summary      Logout
// @Tags         Auth
// @Router       /auth/logout [get]
func (c *Controller) Logout(ctx *gin.Context) {
	q := ctx.Request.URL.Query()
	q.Add("provider", "google")
	ctx.Request.URL.RawQuery = q.Encode()

	gothic.Logout(ctx.Writer, ctx.Request)
	ctx.Writer.Header().Set("Location", "/")
	ctx.Writer.WriteHeader(http.StatusTemporaryRedirect)
}
