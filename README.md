# URL-Shortnener
This is the full-stack URL-Shortener project with the main emphasis on server and DevOps side. 

## Main goals of this project:
-  Learn Go
-  Practice load balancing with NGINX
-  Deploy of containerized apps with DigitalOcean and Docker Compose
-  Try some NoSQL databases using Redis as an example
-  Set up GitHub Actions for deploying containers with application automatically on push requests

## Local development
With the hep of **Visual Studio Code Dev Containers** you can easily develop frontend and backend parts. I also created localhost https certificate in certbot folder for convinient testing

**Steps for local development**
1. Start dev container using **docker-compose.yml** in root and **docker-compose.yml** in **/backend/.devcontainers** directory (It will be better if you use VS Code Dev Containers extension in backend folder)
2. Inside **/client** folder start react debugging server using `npm run start` command

**Steps for local testing your containers**
1. `docker compose build`
2. `docker compose up`
3. That's all )

**Steps to setup production**
1. Start your server with `docker compose -f docker-compose.yml -f docker-compose.prod.yml up`
2. Generate https certificate for your server using Let's encrypt container run
3. Restart your compose and you are ready to go!
