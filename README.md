<div align="center">
  <img src="/assets/lattice_banner_1778588749257.png" width="100%" alt="Lattice Banner" />
  
  # <img src="/icon.png" height="48" style={{ verticalAlign: 'middle' }} /> Lattice
  
  **The definitive ecosystem for urban discovery and festival management in Barcelona.**
  
  *Built with a high-performance Modular Monolith architecture within a Turborepo.*
</div>

---

## 🌐 Documentation Portal

Explore our comprehensive, domain-driven documentation. Each section is designed to provide deep technical insights and operational guidance.

| Domain | Key Areas | Description |
| :--- | :--- | :--- |
| **[Product](/product)** | Vision, Roadmap | Market objectives and long-term strategy. |
| **[Architecture](/architecture)** | System Design, ADRs | Technical blueprint and architectural decisions. |
| **[API Spec](/api-spec)** | RESTful Contracts | Shared data schemas and service interfaces. |
| **[Engineering](/engineering)** | Standards, Workflow | Coding guidelines and developer productivity. |
| **[Guides](/guides)** | Onboarding, Ops | Step-by-step manuals for users and devs. |

---

## Quick Start

> [!IMPORTANT]
> Ensure you have **Docker**, **Node.js (v18+)**, and **pnpm (v8+)** installed.

1.  **Dependencies**: `pnpm install`
2.  **Infrastructure**: `docker-compose up -d`
3.  **Database**: `pnpm --filter @app/db db:migrate && pnpm --filter @app/db db:seed`
4.  **Launch**: `pnpm dev` (Starts API, Admin Web, and Mobile)

---

## Technology Stack

-   **Backend**: Node.js (Express) with **Drizzle ORM**.
-   **Database**: PostgreSQL + **PostGIS** for geospatial optimization.
-   **Mobile**: React Native (Expo) with **MapLibre GL** for 60fps mapping.
-   **Admin**: Next.js 14 with high-density operational dashboards.
-   **Auth**: Custom JWT authentication with bcrypt password hashing.
-   **Tooling**: Turborepo, Docker, and Vitest.

## Shared Packages

-   `@app/db`: SSOT for schema and migrations.
-   `@app/types-schema`: Universal TypeScript definitions.
-   `@app/core`: Shared utilities and middleware.
-   `@app/theme`: Visual DNA for all platforms.

---

## Contributing

We follow **Conventional Commits**. Please review our **[Git Standards](/engineering/coding-standards)** before opening a Pull Request.
