package main

import (
	"fmt"
	"log"

	"github.com/Endesapt/url_shortener_go/controller"
	"github.com/Endesapt/url_shortener_go/docs"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//	@description This is a simple project that i am using to learn Go and other interesting stuff
//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

func main() {
	docs.SwaggerInfo.Title = "Url-Shortener v1"
	arr, err := godotenv.Read()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	fmt.Println(arr)

	r := gin.Default()
	rdb := redis.NewClient(&redis.Options{
		Addr: arr["REDIS_ADDR"],
	})

	c := controller.NewController(rdb)
	r.GET("link/:id", c.RedirectURL)
	v1 := r.Group("/api/v1")
	{
		v1.POST("/shortenURL", c.ShortenUrl)
		v1.GET("/getInfo/:id", c.GetInfo)
	}
	r.GET("/ip", func(c *gin.Context) {
		ip := c.ClientIP()
		c.String(200, ip)
	})
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	r.Run(":8080")

}
