## Why

The current TypeScript configuration in the Lattice monorepo is inconsistent across packages, leading to compilation errors during deployment (TS2835, TS6307, TS6310). The move to ESM has introduced friction where strict module resolution requires `.js` extensions that conflict with the source-based development workflow. This change aims to establish a unified, professional TypeScript architecture that works seamlessly for both local development and production Docker builds.

## What Changes

- **Standardized Module Resolution**: Transition to `moduleResolution: "bundler"` (or consistent `nodenext`) to eliminate the requirement for explicit `.js` extensions in local imports while maintaining ESM compatibility.
- **Unified Project References**: Correctly implement `composite: true` and `references` across all packages. Every shared package will emit its own declarations and JS to a `dist/` folder.
- **Solution-Style Root Config**: Configure the root `tsconfig.json` as a "solution" file (using `files: []` and `references`) to manage the entire monorepo as a single unit.
- **Clean Shared Exports**: Standardize `package.json` exports for `@app/core`, `@app/db`, and `@app/types-schema` to use the compiled `dist/` outputs for production.

## Capabilities

### New Capabilities
- `typescript-compilation-standards`: A new specification defining how TypeScript projects must be structured and linked within the Lattice monorepo.

### Modified Capabilities
- `ci-cd-standards`: Update the build phase to leverage the new TypeScript architecture (e.g., using `tsc --build` instead of individual filters where appropriate).

## Impact

- **Affected Code**: Every `tsconfig.json` in the repository.
- **Imports**: Cleanup of relative imports in `packages/db` that were forced to use `.js` extensions.
- **CI/CD**: The `Dockerfile` and `deploy-backend.yml` will benefit from a more predictable build process.
