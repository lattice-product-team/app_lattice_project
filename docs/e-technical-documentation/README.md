# E - Technical Documentation

Welcome to the technical heart of Lattice. This section explains the system architecture, code organization, and API specifications.

## 1. System Architecture
Comprehensive guides on how the different components of the system interact.
- [Overview](./overview.md)
- [Backend Architecture](./backend.md)
- [Frontend Architecture](./frontend.md)
- [System Prompt (AI-Ready)](./system-prompt.md)
- [Design Decisions](./decisions.md)

## 2. API Specifications
Lattice uses a contract-first approach for its API.
- [API Contract](./api-contract.md)
- [Interactive Swagger UI](http://localhost:3000/api-docs) *(Available when running the API locally)*

## 3. Code Structure
The project is a pnpm monorepo organized for scalability:
- **`apps/api`**: Express backend providing REST endpoints.
- **`apps/mobile`**: React Native application for end-users.
- **`apps/web`**: Next.js dashboard for administration.
- **`packages/`**: Shared TypeScript types, utility functions, and database schemas.

## 4. Contributing
If you are new to the project, start by reading the [Frontend](./frontend.md) and [Backend](./backend.md) architecture guides to understand the data flow and state management patterns.
