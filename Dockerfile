# --- Base Stage (Shared) ---
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# --- Dependencies Stage (Shared) ---
FROM base AS dependencies
# Copy root workspace and lockfile
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc ./
COPY packages/types-schema/package.json ./packages/types-schema/
COPY packages/db/package.json ./packages/db/
COPY packages/core/package.json ./packages/core/
COPY apps/server/api/package.json ./apps/server/api/
COPY apps/server/auth/package.json ./apps/server/auth/
COPY apps/server/geo/package.json ./apps/server/geo/
COPY apps/server/social/package.json ./apps/server/social/
COPY apps/admin-web/package.json ./apps/admin-web/

RUN pnpm install --frozen-lockfile

# --- Builder Stage (Shared logic for common packages) ---
FROM dependencies AS builder
COPY . .
# Build everything using TypeScript Project References (Solution Style)
RUN pnpm tsc --build

# --- API (Monolith) Support ---
FROM builder AS api-dev
ENV NODE_ENV=development
CMD ["pnpm", "dev", "--filter=@app/api"]

FROM builder AS api-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
RUN corepack enable
CMD ["npx", "tsx", "apps/server/api/index.ts"]

# --- ADMIN-WEB Support ---
FROM builder AS admin-web-dev
ENV NODE_ENV=development
CMD ["pnpm", "dev", "--filter=admin-web"]

FROM builder AS admin-web-builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# Next.js still needs its own build process
RUN pnpm build --filter=admin-web

FROM node:20-alpine AS admin-web-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=admin-web-builder /app /app
WORKDIR /app/apps/admin-web
CMD ["npx", "next", "start", "-p", "3000"]
