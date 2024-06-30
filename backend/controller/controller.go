package controller

import (
	"github.com/redis/go-redis/v9"
)

type Controller struct {
	RedisClient *redis.Client
}

func NewController(redisClient *redis.Client) *Controller {
	return &Controller{
		RedisClient: redisClient,
	}
}
