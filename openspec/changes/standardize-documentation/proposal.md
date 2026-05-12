## Why

The previous documentation was fragmented, inconsistent, and recently cleared. To operate like a high-growth tech company, the project needs a domain-driven documentation structure that separates architectural decisions, API specifications, engineering standards, and product vision. This will improve onboarding, reduce technical debt, and ensure architectural consistency across the monorepo.

## What Changes

- **Infrastructure**: Establish a robust `_meta.json` hierarchy for navigation.
- **Architecture**: Create a `system-overview.md` and initial ADRs (Architectural Decision Records) in `docs/architecture/`.
- **API**: Define core service interfaces in `docs/api-spec/`.
- **Engineering**: Document monorepo workflow (pnpm, Docker, workspace boundaries) and coding standards in `docs/engineering/`.
- **Guides**: Create onboarding and "How-to" guides in `docs/guides/`.
- **Product**: Document the core value proposition and feature roadmap in `docs/product/`.

## Capabilities

### New Capabilities
- `documentation-framework`: Core navigation, metadata structure, and domain-driven hierarchy.
- `architecture-docs`: High-level system design, service boundaries, and ADR system.
- `api-documentation`: Standardization of API specs for internal and external consumers.
- `engineering-standards`: Monorepo development workflow, CI/CD patterns, and coding guidelines.

### Modified Capabilities
- None.

## Impact

- **Filesystem**: Multiple new markdown files and `_meta.json` files across the `docs/` directory.
- **Developer Experience**: Significantly faster onboarding and clearer decision-making paths.
- **Maintenance**: Structured location for all future technical and product documentation.
