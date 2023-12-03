FROM node:21-alpine

EXPOSE 3001

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD [ "npm", "run", "start"]
