## Context

The Lattice backend is currently composed of four separate Node.js services (Gateway, Auth, Geo, Social). Each service runs in its own container, requiring its own port, memory allocation, and complex networking via a reverse proxy (the Gateway). This architecture is over-engineered for the current project requirements and creates significant overhead on self-hosted infrastructure.

## Goals / Non-Goals

**Goals:**

- Consolidate all backend logic into a single executable service named `api`.
- Maintain the modular file structure (separate folders for auth, geo, etc.) for future portability.
- Reduce overall memory consumption by ~60%.
- Simplify the deployment pipeline and docker-compose configuration.

**Non-Goals:**

- Merging the `admin-web` (Next.js) into the backend.
- Refactoring the internal logic of the controllers or services.

## Decisions

### 1. Repurpose Gateway as the Monolith Entry Point

The existing `apps/server/gateway` will be renamed or repurposed as `apps/server/api`.

- **Rationale**: It already contains the security infrastructure (Helmet, CORS, Rate Limit) and routing logic.
- **Implementation**: Instead of using `http-proxy-middleware`, it will import the Express routers directly from `../auth`, `../geo`, and `../social`.

### 2. Direct Router Mounting

We will use Express's built-in modularity to mount services.

- **Implementation**:
  ```typescript
  import authRouter from '../auth/routes/auth.routes';
  import geoRouter from '../geo/routes/geo.routes';
  // ...
  router.use('/auth', authRouter);
  router.use('/geo', geoRouter);
  ```

### 3. Consolidated Docker Stage

The `Dockerfile` will be updated to remove separate prod stages for sub-services.

- **Implementation**: A single `api-prod` stage will replace `gateway-prod`, `auth-prod`, etc.

### 4. Shared Configuration Logic

The `@app/core` config loader will be updated to provide a unified `API_URL` while keeping sub-service configurations (like JWT secrets) for the shared process.

## Risks / Trade-offs

- **[Risk] Namespace Collisions** → **[Mitigation]** We are already using prefixes (e.g., `/v1/auth`, `/v1/geo`), so routes won't collide.
- **[Risk] Process Crash** → **[Mitigation]** Standardizing error handling in `@app/core` to ensure one faulty request doesn't bring down the whole process.
- **[Trade-off] Horizontal Scaling** → We lose the ability to scale only the "Geo" service, but we gain significant efficiency and simplicity, which is a net win for the current scale.
