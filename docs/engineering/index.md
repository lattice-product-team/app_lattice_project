import { Callout } from 'nextra/components'

# Engineering at Lattice

Welcome to the **Lattice Engineering Portal**. This domain houses our standards, development workflows, and strict engineering guidelines. It is designed to empower contributors to build highly performant, type-safe, and scalable spatial applications.

---

## Core Engineering Principles

Lattice adheres to five fundamental engineering pillars:
1. **Type Completeness**: Strict TypeScript configurations (`strict: true`, `noImplicitAny: true`) are enforced across all workspaces.
2. **Zero-Overhead Abstractions**: Prioritizing lightweight, fast-compiling solutions (like Drizzle ORM and Vanilla CSS) over heavy, high-overhead frameworks.
3. **Geospatial Rigor**: Treating spatial dimensions as first-class citizens using native PostGIS database models and WGS 84 standard projections.
4. **Workspace Segregation**: Enforcing decoupled boundaries between applications and shared packages using Turborepo pipelines.
5. **Traceable Collaborations**: Enforcing strict branch lifecycle patterns and conventional commits for transparent development cycles.

---

## Engineering Domain Modules

To navigate the engineering documentation, explore the following dedicated modules:

### Standards and Environments
*   **[Technology Stack](./tech-stack.md)**: Deep dive into the technologies, databases, and frameworks driving the Lattice ecosystem.
*   **[Coding Standards](./coding-standards.md)**: Specific coding rules, memoization guidelines, database constraints, and accessibility requirements.
*   **[Git & Collaboration](./git-standards.md)**: Commit formatting patterns, branch naming structures, and code review processes.

### Operational Workflows
*   **[Monorepo Workflow](./monorepo-workflow.md)**: Master developer commands for pnpm workspaces, Turborepo task caching pipelines, and Docker containers.

---

## Technical Guides and Support

If you are setting up your local machine for the first time or troubleshooting active services, refer directly to our comprehensive step-by-step guides:

*   For first-time environment installation, check out the **[Getting Started Guide](../guides/getting-started.md)**.
*   For active debugging, connection testing, and resolving common errors, view the **[Troubleshooting Guide](../guides/troubleshooting.md)**.

<Callout type="info">
  **Continuous Integration**: Every pull request opened in the monorepo automatically triggers our GitHub Actions pipeline, which builds all packages, executes the linting suites, and runs the entire integration test suite.
</Callout>
