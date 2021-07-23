FROM node:16-alpine3.11

WORKDIR /my-backend

COPY package.json ./

RUN npm install

RUN mkdir my-backend-project
RUN cd my-backend-project

COPY . .