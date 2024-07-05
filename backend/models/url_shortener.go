package models

type UrlShortenResponse struct {
	ShortURL string `json:"shortUrl"`
	IssuerID string
}
type UrlInfoResponse struct {
	Count       int      `json:"count" redis:"count"`
	IPs         []string `json:"ips"`
	OriginalUrl string   `json:"originalUrl" redis:"originalUrl"`
	IssuerEmail string   `json:"issuerEmail" redis:"issuerEmail"`
}

type UrlEdit struct {
	ShortUrl    string `json:"shortUrl" binding:"required"`
	OriginalUrl string `json:"originalUrl" binding:"required"`
}
