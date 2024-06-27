package main

import (
	"github.com/Endesapt/url_shortener_go/controller"
	docs "github.com/Endesapt/url_shortener_go/docs"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//	@BasePath /api/v1
//	@title Url-Shortener v1
//	@description This is a simple project that i am using to learn Go and other interesting stuff
//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

func main() {
	r := gin.Default()
	docs.SwaggerInfo.BasePath = "/api/v1"
	c := controller.NewController()
	v1 := r.Group("/api/v1")
	{
		v1.POST("/shortenURL", c.ShortenUrl)
	}
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	r.Run(":8080")

}
