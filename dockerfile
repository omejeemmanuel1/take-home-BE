FROM node:18-alpine as compilation

WORKDIR /compile

COPY . .

RUN yarn 

RUN yarn tsc

# stage 2
FROM node:18-alpine

WORKDIR /app

COPY --from=compilation /compile/dist  ./dist

COPY  [".env","package.json", "yarn.lock", "./"]

COPY bin ./bin

RUN yarn --prod

CMD ["node", "bin/www"]

EXPOSE 4000