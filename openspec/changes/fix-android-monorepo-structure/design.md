## Context

The current EAS Build setup fails during dependency installation because the build is triggered within a sub-workspace (`apps/mobile`) without proper context of the monorepo root (where `pnpm-lock.yaml` and shared packages reside). Additionally, an outdated `app.json` at the root conflicts with the actual app configuration.

## Goals / Non-Goals

**Goals:**
- Centralize EAS configuration at the monorepo root.
- Eliminate configuration conflicts at the root.
- Enable successful `pnpm` dependency resolution in the EAS cloud environment.

**Non-Goals:**
- Migrating the app from `app.config.ts` back to `app.json`.
- Modifying the internal logic of the mobile application.

## Decisions

### 1. Root-Level `eas.json`
**Decision**: Move `eas.json` from `apps/mobile/` to the project root.
**Rationale**: EAS CLI handles monorepos more reliably when the configuration is at the root. It ensures the whole workspace is uploaded and `pnpm install` is executed with the correct context.
**Alternative**: Keeping it in `apps/mobile` and using `--project-root ../..`. (Rejected as it's more prone to path resolution errors in CI).

### 2. Elimination of Root `app.json`
**Decision**: Delete `/app.json`.
**Rationale**: This file is a remnant of a previous project structure and causes EAS to misidentify the root as an independent Expo project.
**Alternative**: Merging it into `apps/mobile/app.config.ts`. (Already done, so the file is redundant).

### 3. Root Script Proxies
**Decision**: Update root `package.json` scripts to use `eas build` from the root context.
**Rationale**: Simplifies the developer experience and ensures the build is always triggered with the correct project root detection.

## Risks / Trade-offs

- **Risk**: EAS might still fail if it doesn't auto-detect the app in `apps/mobile`.
- **Mitigation**: We will ensure the `eas build` command is run from the root but points to the app directory if necessary, although moving `eas.json` to the root usually solves this as EAS looks for `app.json` in subdirectories.
