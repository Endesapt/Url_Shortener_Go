// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/auth/google": {
            "post": {
                "description": "Returns credentials from code sended from client",
                "tags": [
                    "Auth"
                ],
                "summary": "Login",
                "parameters": [
                    {
                        "description": "Code from google auth",
                        "name": "code",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {}
            }
        },
        "/auth/logout": {
            "post": {
                "description": "deletes your credentials",
                "tags": [
                    "Auth"
                ],
                "summary": "Logout",
                "responses": {}
            }
        },
        "/auth/refresh": {
            "post": {
                "description": "refresh your credentials",
                "tags": [
                    "Auth"
                ],
                "summary": "Refresh",
                "responses": {}
            }
        },
        "/deleteURL/{id}": {
            "delete": {
                "description": "Delete link with id in case you are the owner of the link",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "URL Info/Edit"
                ],
                "summary": "Delete link with id",
                "parameters": [
                    {
                        "type": "string",
                        "description": "id",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "id_token",
                        "name": "id_token",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    }
                }
            }
        },
        "/editURL/{id}": {
            "patch": {
                "description": "Edit link with id in case you are the owner of the link",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "URL Info/Edit"
                ],
                "summary": "Edit link with id",
                "parameters": [
                    {
                        "type": "string",
                        "description": "id",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "id_token",
                        "name": "id_token",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    },
                    {
                        "description": "Edit Info",
                        "name": "linkInfo",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.UrlEdit"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.UrlEdit"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    }
                }
            }
        },
        "/getInfo/{id}": {
            "get": {
                "description": "Get info about how many times and what IPs where entering your site",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "URL Info/Edit"
                ],
                "summary": "Info about shorten URL",
                "parameters": [
                    {
                        "type": "string",
                        "description": "id",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.UrlInfoResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    }
                }
            }
        },
        "/getLinks": {
            "get": {
                "description": "Get all links that associated your account if you are registered",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "ShortenURL"
                ],
                "summary": "Get all links",
                "parameters": [
                    {
                        "type": "string",
                        "description": "id_token",
                        "name": "id_token",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    }
                }
            }
        },
        "/shortenURL": {
            "post": {
                "description": "Shortens your  URL to small format for you to use it",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "ShortenURL"
                ],
                "summary": "Shorten URL",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Shorten URL",
                        "name": "url",
                        "in": "query",
                        "required": true
                    },
                    {
                        "description": "id_token",
                        "name": "id_token",
                        "in": "body",
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.UrlShortenResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    }
                }
            }
        },
        "/{id}": {
            "get": {
                "description": "Redirects to link that you have enetered on shortenURL path",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "ShortenURL"
                ],
                "summary": "Redirect to link",
                "parameters": [
                    {
                        "type": "string",
                        "description": "id",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "302": {
                        "description": "Found"
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/httputil.HTTPError"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "httputil.HTTPError": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "integer",
                    "example": 400
                },
                "message": {
                    "type": "string",
                    "example": "status bad request"
                }
            }
        },
        "models.UrlEdit": {
            "type": "object",
            "required": [
                "originalUrl",
                "shortUrl"
            ],
            "properties": {
                "originalUrl": {
                    "type": "string"
                },
                "shortUrl": {
                    "type": "string"
                }
            }
        },
        "models.UrlInfoResponse": {
            "type": "object",
            "properties": {
                "count": {
                    "type": "integer"
                },
                "ips": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "issuerEmail": {
                    "type": "string"
                },
                "originalUrl": {
                    "type": "string"
                }
            }
        },
        "models.UrlShortenResponse": {
            "type": "object",
            "properties": {
                "issuerID": {
                    "type": "string"
                },
                "shortUrl": {
                    "type": "string"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "",
	Host:             "",
	BasePath:         "",
	Schemes:          []string{},
	Title:            "",
	Description:      "This is a simple project that i am using to learn Go and other interesting stuff",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
