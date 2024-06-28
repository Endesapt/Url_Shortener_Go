package models

type UrlShortenResponse struct {
	ShortURL string `json:"shortUrl"`
}
type UrlInfoResponse struct {
	Count       int      `json:"count" redis:"count"`
	IPs         []string `json:"ips"`
	OriginalUrl string   `json:"originalUrl" redis:"originalUrl"`
}
