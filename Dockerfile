FROM node:21-alpine
EXPOSE 3000

ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

RUN apk add --no-cache wireguard-tools

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

CMD [ "npm", "run", "start"]
