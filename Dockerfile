FROM node:14 AS build
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


FROM node:14-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

ENV DB_USERNAME=$DB_USERNAME \
    DB_PASSWORD=$DB_PASSWORD \
    DB_PORT=$DB_PORT

RUN npm install --production

EXPOSE 8000

CMD ["npm", "start"]