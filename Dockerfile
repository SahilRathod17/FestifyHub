FROM node:14 AS build
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


FROM node:14-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

RUN --mount=type=secret,id=DB_USERNAME \
    sed -i "s/DB_USERNAME=/DB_USERNAME=$(cat /run/secrets/DB_USERNAME)/" .env.production

RUN --mount=type=secret,id=DB_USERNAME \
    sed -i "s/DB_PASSWORD=/DB_PASSWORD=$(cat /run/secrets/DB_PASSWORD)/" .env.production

RUN npm install --production

EXPOSE 8000

CMD ["npm", "start"]