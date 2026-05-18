## ADDED Requirements

### Requirement: Solution-Style Project Orchestration

The monorepo MUST use a root `tsconfig.json` that references all child packages and services via the `references` property and sets `files: []` to act as a solution orchestrator.

#### Scenario: Orchestrated Build

- **WHEN** running `tsc --build` from the root directory
- **THEN** TypeScript MUST correctly identify and build all referenced packages in the correct dependency order.

### Requirement: Universal Composite Configuration

Every package and service within the monorepo SHALL be configured as a `composite` project with `incremental: true` to support efficient cross-package type checking.

#### Scenario: Incremental Validation

- **WHEN** a change is made in a shared package
- **THEN** only the affected package and its direct dependants MUST be re-validated during the next build pass.

### Requirement: Modern Module Resolution

All backend projects SHALL use `moduleResolution: "bundler"` to allow import statements without explicit file extensions while maintaining ESM compatibility.

#### Scenario: Clean Import Syntax

- **WHEN** importing a local module (e.g., `import { foo } from './bar'`)
- **THEN** the TypeScript compiler MUST resolve the file without requiring a `.js` extension.

### Requirement: Library Export Contract

All shared packages MUST emit their compiled JavaScript and type declarations to a `dist/` directory, and their `package.json` MUST point to these files in the `main` and `types` fields.

#### Scenario: Production Consumption

- **WHEN** a service is built for production
- **THEN** it MUST resolve workspace dependencies using their compiled `dist/` artifacts instead of their source files.
