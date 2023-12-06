# FROM node:21-alpine
# EXPOSE 3000

# ENV NODE_ENV=production
# ENV SKIP_ENV_VALIDATION=1

# RUN apk add --no-cache wireguard-tools

# RUN mkdir /app
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm ci

# COPY . .
# RUN npx prisma generate && npm run build

# CMD [ "npm", "run", "start"]


# ---- Base Node ----
FROM node:21-alpine AS base
WORKDIR /app
RUN apk add --no-cache wireguard-tools

# ---- Dependencies, Copy Files/Build ----
FROM base AS build  

ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

# ---- Release ----
FROM base AS release  

ARG VERSION=development

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV VERSION=$VERSION

EXPOSE 3000

WORKDIR /app
# COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

CMD ["node", "server.js"]