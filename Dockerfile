# ───────────────────────────────────────────────────────────────────────────────
# 1) BUILD STAGE: install all deps, compile TS, build Next.js
# ───────────────────────────────────────────────────────────────────────────────
ARG NPM_VERSION=11.14.1

FROM node:24-alpine AS builder

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
FROM node:24-alpine AS production

ARG NPM_VERSION

WORKDIR /app

RUN npm install -g "npm@${NPM_VERSION}"

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
