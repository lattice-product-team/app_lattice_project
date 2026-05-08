## Context

The Lattice monorepo is an ESM-first project using `pnpm` workspaces. The transition to `composite` TypeScript projects (Project References) has revealed deep inconsistencies in how modules are resolved and how files are emitted. Specifically, the use of `nodenext` resolution has forced the inclusion of `.js` extensions in source files, which breaks the intuitive development flow and causes `TS2835` errors when mixed with other configurations.

## Goals / Non-Goals

**Goals:**
- Eliminate all `tsc` compilation errors in local and production environments.
- Enable full IDE support (Go-to-Definition) across the entire monorepo.
- Leverage `tsc --build` for reliable, incremental, and order-aware builds.
- Standardize on a module resolution strategy that is compatible with modern tools (tsx, Next.js).

**Non-Goals:**
- Migrating away from ESM (we stay in ESM).
- Changing the fundamental directory structure of the monorepo.

## Decisions

### 1. Solution-Style Root Orchestration
We will adopt the "Solution Style" `tsconfig.json` at the root.
- **Rationale**: This is the recommended pattern for TypeScript 5.0+ monorepos. It prevents the root compiler from getting confused by global state and instead delegates all work to the specific project references.
- **Implementation**: Set `"files": []` in the root `tsconfig.json` and provide a comprehensive list of `"references"`.

### 2. Standardized Module Resolution: "Bundler"
We will switch from `node16`/`nodenext` to `moduleResolution: "bundler"`.
- **Rationale**: The `bundler` resolution strategy (TS 5.0+) provides the benefits of ESM while relaxing the strict requirement for `.js` extensions in imports. This resolves the `TS2835` errors and matches the behavior of our runtime tools like `tsx` and `next`.
- **Alternative considered**: Staying with `nodenext` and fixing all imports. **Rejected** because it is too high-maintenance and non-intuitive for most developers.

### 3. Comprehensive Composite Configuration
Every shared package (`core`, `db`, `types-schema`) and every service (gateway, auth, etc.) will be a first-class `composite` project.
- **Rationale**: Ensures that `tsc --build` can track dependencies.
- **Requirement**: Each package MUST emit its output. We will ensure `"noEmit": false` is set for libraries and they produce `.d.ts` files in `dist/`.

### 4. Consolidated Build Script
We will update the `Dockerfile` to use a single `pnpm tsc --build` command at the root (or per service) instead of chaining individual turbo filters for TypeScript.
- **Rationale**: `tsc --build` is purpose-built to handle project references and ordering more reliably than generic task runners for this specific task.

## Risks / Trade-offs

- **[Risk] Outdated build artifacts** → **[Mitigation]** The `Dockerfile` will always run a fresh build. In development, `tsx` handles source-to-source resolution via the `paths` we will restore in the root config.
- **[Risk] Complex setup** → **[Mitigation]** Once established, it is a "set and forget" architecture that follows official TS best practices.
