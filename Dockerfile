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
COPY apps/mobile/package.json ./apps/mobile/
COPY packages/theme/package.json ./packages/theme/

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

# --- Production Dependencies stage ---
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc ./
COPY packages/types-schema/package.json ./packages/types-schema/
COPY packages/db/package.json ./packages/db/
COPY packages/core/package.json ./packages/core/
COPY apps/server/api/package.json ./apps/server/api/
COPY apps/server/auth/package.json ./apps/server/auth/
COPY apps/server/geo/package.json ./apps/server/geo/
COPY apps/server/social/package.json ./apps/server/social/
COPY apps/admin-web/package.json ./apps/admin-web/
COPY apps/mobile/package.json ./apps/mobile/
COPY packages/theme/package.json ./packages/theme/

RUN pnpm install --prod --frozen-lockfile

# --- API (Monolith) Production Stage ---
FROM base AS api-prod
WORKDIR /app
ENV NODE_ENV=production
# Copy only necessary artifacts and production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/packages ./packages
COPY --from=prod-deps /app/apps ./apps
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/types-schema/dist ./packages/types-schema/dist
# Copy all source code for the server apps
COPY --from=builder /app/apps/server ./apps/server
CMD ["npx", "tsx", "apps/server/api/index.ts"]

# --- ADMIN-WEB Support ---
FROM builder AS admin-web-dev
ENV NODE_ENV=development
CMD ["sh", "-c", "rm -rf apps/admin-web/.next/* && pnpm dev --filter=admin-web"]

FROM builder AS admin-web-builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# Next.js still needs its own build process
RUN pnpm build --filter=admin-web

FROM base AS admin-web-prod
WORKDIR /app
ENV NODE_ENV=production
# Copy production dependencies and the built next.js app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/admin-web/package.json ./apps/admin-web/package.json
COPY --from=admin-web-builder /app/apps/admin-web/.next ./apps/admin-web/.next
COPY --from=admin-web-builder /app/apps/admin-web/public ./apps/admin-web/public

WORKDIR /app/apps/admin-web
CMD ["sh", "-c", "npx next start -p ${PORT:-3000}"]
