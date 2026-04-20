# --- Base Stage (Shared) ---
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# --- Dependencies Stage (Shared) ---
FROM base AS dependencies
# Copy root config and ALL package.json files to optimize caching
COPY package.json pnpm-lock.yaml* .npmrc ./
COPY packages/types-schema/package.json ./packages/types-schema/
COPY packages/db/package.json ./packages/db/
COPY packages/core/package.json ./packages/core/
COPY apps/server/gateway/package.json ./apps/server/gateway/
COPY apps/server/auth/package.json ./apps/server/auth/
COPY apps/server/geo/package.json ./apps/server/geo/
COPY apps/server/social/package.json ./apps/server/social/

RUN pnpm install --frozen-lockfile

# --- Builder Stage (Shared logic for common packages) ---
FROM dependencies AS builder
COPY . .
# Build common packages once
RUN pnpm build --filter=@app/types-schema || true
RUN pnpm build --filter=@app/db || true
RUN pnpm build --filter=@app/core || true

# --- GATEWAY Support ---
FROM builder AS gateway-dev
ENV NODE_ENV=development
CMD ["pnpm", "dev", "--filter=@app/gateway"]

FROM builder AS gateway-builder
RUN pnpm build --filter=@app/gateway
FROM node:20-alpine AS gateway-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=gateway-builder /app /app
RUN corepack enable
CMD ["npx", "tsx", "apps/server/gateway/index.ts"]

# --- AUTH Support ---
FROM builder AS auth-dev
ENV NODE_ENV=development
CMD ["pnpm", "dev", "--filter=@app/auth"]

FROM builder AS auth-builder
RUN pnpm build --filter=@app/auth
FROM node:20-alpine AS auth-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=auth-builder /app /app
RUN corepack enable
CMD ["npx", "tsx", "apps/server/auth/index.ts"]

# --- GEO Support ---
FROM builder AS geo-dev
ENV NODE_ENV=development
CMD ["pnpm", "dev", "--filter=@app/geo"]

FROM builder AS geo-builder
RUN pnpm build --filter=@app/geo
FROM node:20-alpine AS geo-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=geo-builder /app /app
RUN corepack enable
CMD ["npx", "tsx", "apps/server/geo/index.ts"]

# --- SOCIAL Support ---
FROM builder AS social-dev
ENV NODE_ENV=development
CMD ["pnpm", "dev", "--filter=@app/social"]

FROM builder AS social-builder
RUN pnpm build --filter=@app/social
FROM node:20-alpine AS social-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=social-builder /app /app
RUN corepack enable
CMD ["npx", "tsx", "apps/server/social/index.ts"]
