FROM node:21-alpine
EXPOSE 3001

ENV SKIP_ENV_VALIDATION=1

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

RUN echo "AUTH_SECRET=$(openssl rand -base64 32)" > .env.local

CMD [ "npm", "run", "start"]
