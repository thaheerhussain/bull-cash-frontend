FROM node:14-alpine
  
RUN apk add --no-cache --virtual .build-deps make gcc g++ python3
RUN apk del .build-deps

WORKDIR /opt/app

COPY package*.json ./

COPY . /opt/app

RUN apk add --no-cache git
RUN yarn install

RUN yarn build

CMD [ "npm", "start" ]