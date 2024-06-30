package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Endesapt/url_shortener_go/controller"
	"github.com/Endesapt/url_shortener_go/docs"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"github.com/redis/go-redis/v9"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//	@description This is a simple project that i am using to learn Go and other interesting stuff
//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

func main() {
	docs.SwaggerInfo.Title = "Url-Shortener v1"

	//environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	//redis database connection
	rdb := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_ADDR"),
	})

	//goth setup
	key := os.Getenv("SESSION_SECRET") // Replace with your SESSION_SECRET or similar
	maxAge := 86400 * 30               // 30 days
	isProd := false                    // Set to true when serving over https

	store := sessions.NewCookieStore([]byte(key))
	store.MaxAge(maxAge)
	store.Options.Path = "/"
	store.Options.SameSite = http.SameSiteDefaultMode
	store.Options.HttpOnly = true // HttpOnly should always be enabled
	store.Options.Secure = isProd

	gothic.Store = store
	goth.UseProviders(
		google.New(os.Getenv("AUTH_CLIENT_ID"),
			os.Getenv("AUTH_CLIENT_SECRET"), os.Getenv("AUTH_CALLBACK_URL")),
	)

	//gin router
	c := controller.NewController(rdb)
	r := gin.Default()
	r.GET("link/:id", c.RedirectURL)
	v1 := r.Group("/api/v1")
	{
		v1.POST("/shortenURL", c.ShortenUrl)
		v1.GET("/getInfo/:id", c.GetInfo)
		v1.GET("/getLinks", c.GetLinks)
	}
	auth := r.Group("/auth")
	{
		auth.GET("/login", c.Login)
		auth.GET("/callback", c.Callback)
		auth.GET("logout", c.Logout)
	}
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	r.Run(":8080")

}
