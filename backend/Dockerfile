FROM golang:1.22-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

ENV GIN_MODE=release
RUN CGO_ENABLED=0 GOOS=linux go build -o myapp .


FROM alpine:edge

WORKDIR /app

COPY --from=build ./app/myapp .


ENV GIN_MODE=release
RUN apk --no-cache add ca-certificates tzdata

ENTRYPOINT ["/app/myapp"]