FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .


EXPOSE 3000
EXPOSE 4000
EXPOSE 8080

EXPOSE 3001
EXPOSE 4001
EXPOSE 8081

ENTRYPOINT [ "node",  "server.js" ]