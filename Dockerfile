# ───────────────────────────────────────────────────────────────────────────────
# 1) BUILD STAGE: install all deps, compile TS, build Next.js
# ───────────────────────────────────────────────────────────────────────────────
ARG NPM_VERSION=12.2.0

FROM node:26.10.0-alpine@sha256:0b36e8c136b94cd4fcf02188228e76c31ad5872eef3fec8cbd2eee500cfd9e80 AS builder

ARG NPM_VERSION

WORKDIR /app

RUN npm install -g "npm@${NPM_VERSION}"

# install dev+prod deps (including typescript)
COPY package.json package-lock.json* ./
RUN npm ci

# copy source & build
COPY . .
RUN npm run build


# ───────────────────────────────────────────────────────────────────────────────
# 2) PRODUCTION STAGE: standalone output (minimal footprint)
# ───────────────────────────────────────────────────────────────────────────────
FROM node:26.10.0-alpine@sha256:0b36e8c136b94cd4fcf02188228e76c31ad5872eef3fec8cbd2eee500cfd9e80 AS production

ARG NPM_VERSION

WORKDIR /app

RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy standalone build (includes all dependencies)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# fix ownership so node user can read/write if needed
RUN chown -R node:node /app

# switch to non-root
USER node

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
