FROM node:14.15.5-alpine

RUN apk add npm

RUN rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json /app

COPY tsconfig.json /app

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 4000

CMD [ "node", "./build/src/app.js" ]