FROM node:18-alpine as builder
WORKDIR /app
COPY ./client/package*.json .
RUN npm install
COPY ./client/. .
RUN npm run build

#Stage 2
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html
COPY --from=builder ./app/build .
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]