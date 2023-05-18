FROM node:12-alpine as build

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh yarn

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn run build-docker-bundle

# ---------------

FROM node:12-alpine

RUN mkdir -p /app/build

RUN apk update && apk upgrade && apk add yarn git

WORKDIR /app

COPY --from=build /app/package.json .

RUN yarn install --production

ARG CACHEBUST=1

COPY --from=build /app/build ./build
COPY --from=build /app/src/utils/gateway-ca.crt ./src/utils/gateway-ca.crt
COPY --from=build /app/.env.docker ./.env
COPY --from=build /app/client-server.js .
COPY --from=build /app/service ./service

EXPOSE 3000
EXPOSE 3001

ENV SERVER_PORT=3000
ENV API_PORT=3001
ENV NODE_ENV production

CMD ["yarn", "prod"]
