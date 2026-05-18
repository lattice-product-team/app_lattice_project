import { Callout } from 'nextra/components'

# Monorepo Workflow

This guide details how to develop within the Lattice monorepo. We use **pnpm** and **Turborepo** for package orchestration, and **Docker** to run containerized local infrastructure.

---

<Callout type="info">
  **New to the codebase?** For first-time machine setup, dependencies, and environment keys, refer to the **[Getting Started Guide](../guides/getting-started.md)**. For a technical analysis of shared packages and application layouts, see the **[Monorepo Structure Architecture Guide](../architecture/monorepo-structure.md)**.
</Callout>

---

## 1. Monorepo Operations with pnpm

We leverage `pnpm workspaces` to manage dependencies across multiple applications and libraries under a single lockfile, preventing version mismatch issues.

### Adding Third-Party Dependencies

To add a third-party npm package to a specific workspace (e.g., adding `zod` only to the server API monolith):

```bash
pnpm add zod --filter server
```

To add a dependency globally across all workspaces (e.g., installing `typescript` developer tooling at the monorepo root):

```bash
pnpm add typescript -w -D
```

### Linking Internal Shared Packages

To reference one of our shared packages inside an application workspace (e.g., linking the shared `@app/db` package to the `@app/server` monolith):

```bash
pnpm add @app/db --filter server
```

*This creates a symlink in `apps/server/node_modules/@app/db` pointing directly to `packages/db`, ensuring code changes are instantly reflected without needing manual rebuilds.*

### Running Workspace-Specific Scripts

To run developer scripts or tests inside a single workspace without navigating to its folder:

```bash
pnpm --filter server test
```

To run a command recursively across all workspaces and packages:

```bash
pnpm run build -r
```

---

## 2. Turborepo Caching Pipelines

Turborepo reads the configuration inside `turbo.json` to orchestrate builds, lints, and test pipelines. It compiles tasks in parallel by analyzing dependency relationships.

### Task Caching and Execution

When you run a global task:

```bash
pnpm build
pnpm lint
pnpm test
```

Turborepo evaluates if the source files of the targeted workspaces have changed since the last execution:
*   **Cache Hit**: If no changes are detected, Turborepo returns `>>> FULL TURBO` and retrieves the cached build artifacts in milliseconds.
*   **Cache Miss**: If changes are detected, Turborepo executes the tasks and caches the new outputs.

---

## 3. Docker Container Management

Lattice utilizes Docker Compose to replicate our production database, routing engine, and caching layers locally.

### Key Docker Commands

*   **View Live Logs**: Monitor active standard outputs across all containers:
    ```bash
    docker compose logs -f
    ```
*   **Target Specific Logs**: Limit standard output logs to a single container (e.g., viewing database queries):
    ```bash
    docker compose logs db -f
    ```
*   **Rebuild Container Services**: Rebuild local service containers from scratch:
    ```bash
    docker compose build --no-cache
    ```
*   **Tear Down Services**: Stop and remove active containers without destroying volume data:
    ```bash
    docker compose down
    ```

---

## 4. Pull Request & Verification Routine

Before pushing a branch to the remote repository and opening a Pull Request, verify that all type checks, formatting guidelines, and compilations pass locally:

### 1. Enforce Code Formatting
Run Prettier to format the codebase:
```bash
pnpm format
```

### 2. Verify Code Quality
Execute the linter across all workspaces:
```bash
pnpm lint
```

### 3. Verify Code Compilation
Build all shared packages and applications:
```bash
pnpm build
```

<Callout type="success">
  **Turborepo Smart Caching**: If you make modifications exclusively inside `apps/mobile`, running global test tasks will fetch cached results for `apps/server` and `apps/admin-web`, significantly accelerating local validation times.
</Callout>
