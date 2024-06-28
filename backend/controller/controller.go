package controller

import "github.com/redis/go-redis/v9"

type Controller struct {
	RedisClient *redis.Client
	Urls        map[string]string
}

func NewController(redisClient *redis.Client) *Controller {
	return &Controller{
		RedisClient: redisClient,
		Urls:        make(map[string]string),
	}
}
