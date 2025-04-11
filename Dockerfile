# ---- Base Node ----
FROM node:23-slim AS base

# ---- Dependencies, Copy Files/Build ----
FROM base AS build
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV SKIP_ENV_VALIDATION=true
RUN npx prisma generate && npm run build

# ---- Release ----
FROM base AS release  

RUN apt-get update -y && apt-get install -y wireguard-tools
ARG VERSION=development

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV VERSION=$VERSION
ENV PORT=3000
EXPOSE 3000

WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/prisma ./prisma
# COPY --from=build /app/public ./public

CMD [ "npm", "run", "start"]