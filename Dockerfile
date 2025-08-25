# ───────────────────────────────────────────────────────────────────────────────
# 1) BUILD STAGE: install all deps, compile TS, build Next.js
# ───────────────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

# install latest npm
WORKDIR /app
RUN npm install -g npm@11.5.2

# install dev+prod deps (including typescript)
COPY package.json package-lock.json* ./
RUN npm ci

# copy source & build
COPY . .
RUN npm run build


# ───────────────────────────────────────────────────────────────────────────────
# 2) PRODUCTION STAGE: only prod deps + TS + built output
# ───────────────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS production

WORKDIR /app
RUN npm install -g npm@11.5.2

# copy package manifests
COPY --from=builder /app/package.json   /app/package-lock.json*   ./

# install prod deps only
RUN npm ci --omit=dev

# ensure TS is present so Next.js won't auto-install on 'next start'
RUN npm install typescript

# copy built Next.js and public assets
COPY --from=builder /app/.next         ./.next
COPY --from=builder /app/public        ./public

# copy your config files (if you really need .ts at runtime)
COPY --from=builder /app/next.config.*  ./
COPY --from=builder /app/tsconfig.json  ./

# fix ownership so node user can read/write if needed
RUN chown -R node:node /app

# switch to non-root
USER node

EXPOSE 3000
CMD ["npm", "start"]
