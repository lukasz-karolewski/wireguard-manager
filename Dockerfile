# ---- Base Node ----
FROM node:23-slim AS base

RUN apt-get update -y && apt-get install -y openssl wireguard-tools openssh-client
RUN npm install -g prisma 

# Create .ssh directory with proper permissions
RUN mkdir -p /home/node/.ssh && \
    chown -R node:node /home/node/.ssh && \
    chmod 700 /home/node/.ssh

WORKDIR /app

# ---- Dependencies, Copy Files/Build ----
FROM base AS build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV SKIP_ENV_VALIDATION=true
RUN npx prisma generate && npm run build

# ---- Release ----
FROM base AS release  

ARG VERSION=development

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV VERSION=$VERSION
ENV PORT=3000
EXPOSE 3000

# Switch to node user
USER node

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/prisma ./prisma
# COPY --from=build /app/public ./public

CMD [ "npm", "run", "start"]