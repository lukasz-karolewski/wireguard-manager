FROM node:21-alpine

EXPOSE 3001

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN echo "AUTH_SECRET=$(openssl rand -base64 32)" > .env.local
RUN echo "AUTH_URL_INTERNAL=http://localhost:3000/api/auth" >> .env.local
RUN echo "DATABASE_URL=\"file:./prod.db\"" >> .env.local

CMD [ "npm", "run", "start"]
