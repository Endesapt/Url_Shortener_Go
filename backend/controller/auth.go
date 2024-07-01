package controller

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"

	"github.com/Endesapt/url_shortener_go/httputil"
	"github.com/Endesapt/url_shortener_go/models"
	"github.com/gin-gonic/gin"
	idtoken "google.golang.org/api/idtoken"
)

// @Summary      Login
// @Description  Returns credentials from code sended from client
// @Param        code    body     string  true "Code from google auth"
// @Tags         Auth
// @Router       /auth/google [post]
func (c *Controller) Login(ctx *gin.Context) {
	var loginRequest models.LoginRequest

	if err := ctx.ShouldBind(&loginRequest); err != nil {
		httputil.NewError(ctx, http.StatusBadRequest, errors.New("can't parse URL from request"))
	}

	posturl := "https://oauth2.googleapis.com/token"

	bodyObject := models.TokenRequest{
		Code:         loginRequest.Code,
		ClientId:     os.Getenv("AUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("AUTH_CLIENT_SECRET"),
		RedirectUri:  "postmessage",
		GrantType:    "authorization_code",
	}

	body, err := json.Marshal(bodyObject)
	if err != nil {
		httputil.NewError(ctx, http.StatusBadRequest, errors.New("error encoding code to JSON"))
	}

	r, err := http.NewRequest("POST", posturl, bytes.NewBuffer(body))
	if err != nil {
		httputil.NewError(ctx, http.StatusBadRequest, errors.New("error creating request"))
	}
	r.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(r)
	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	data := &models.TokenResponse{}
	derr := json.NewDecoder(res.Body).Decode(data)
	if derr != nil {
		panic(derr)
	}

	//obtain user info
	payload, err := idtoken.Validate(context.Background(), data.IdToken, os.Getenv("AUTH_CLIENT_ID"))
	if err != nil {
		panic(err)
	}

	response := models.LoginResponse{
		AccessToken: data.AccessToken,
		ExpiresIn:   data.ExpiresIn,
		Email:       payload.Claims["email"].(string),
		PhotoUrl:    payload.Claims["picture"].(string),
	}

	ctx.JSON(http.StatusOK, response)
}
