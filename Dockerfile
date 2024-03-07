FROM node:14 AS build
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


FROM node:14-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

RUN npm install --production

EXPOSE 8000

CMD ["npm", "start"]

