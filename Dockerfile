FROM node:4.1.2
MAINTAINER https://github.com/devos-2015/hello-world-service

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV SERVICE_PORT=3000
ENV SHUTDOWN_TIMEOUT=10000

EXPOSE 3000

CMD ["node", "index.js"]
