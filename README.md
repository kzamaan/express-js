# Express Js

Simple Basic Express Js application

## Features

- Authentication (JWT)
- Authorization (JWT)
- CRUD Operations
- File Upload
- Chat Application (Socket.io)
- Dockerize Application
- Scale Application

## Run Application

To run the application copy the .env.example to .env and update the values

```bash
npm install
npm start
```

## Dockerize Application

To run the application in docker container

```bash
docker-compose up -d --build
```

## Run Application Scale Mode

To run the application in scale mode

```bash
docker-compose up -d --build --scale express-app=3
```

## Show Application container Logs

To show the application container logs

```bash
docker logs -f <container-name>
```
