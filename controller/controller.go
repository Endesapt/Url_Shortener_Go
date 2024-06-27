package controller

type Controller struct {
	Urls map[string]string
}

func NewController() *Controller {
	return &Controller{}
}
