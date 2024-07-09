package main

import (
	"os"
	"time"

	"github.com/Endesapt/url_shortener_go/controller"
	"github.com/Endesapt/url_shortener_go/docs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//	@description This is a simple project that i am using to learn Go and other interesting stuff
//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

func main() {
	docs.SwaggerInfo.Title = "Url-Shortener"
	docs.SwaggerInfo.BasePath = "/api"

	//redis database connection
	rdb := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_ADDR"),
	})

	//gin router
	c := controller.NewController(rdb)
	r := gin.Default()

	//cors
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST", "PATCH", "GET", "DELETE", "PUT"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	v1 := r.Group("/api")
	{
		v1.GET("/:id", c.RedirectURL)
		v1.POST("/shortenURL", c.ShortenUrl)
		v1.DELETE("/deleteURL/:id", c.DeleteURL)
		v1.PATCH("/editURL/:id", c.EditURL)
		v1.GET("/getInfo/:id", c.GetInfo)
		v1.GET("/getLinks", c.GetLinks)
		auth := v1.Group("/auth")
		{
			auth.POST("/google", c.Login)
		}
		v1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	}

	r.Run(":8080")

}
