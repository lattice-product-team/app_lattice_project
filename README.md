<div align="center">
  
  # Lattice
  
  **The definitive ecosystem for urban discovery and festival management in Barcelona.**
  
  *Built with a high-performance Modular Monolith architecture within a Turborepo.*

  <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '16px 0', justifyContent: 'center' }}>
    <img src="/assets/mockups/map-2.png" alt="Dynamic Map Interface" style={{ height: '380px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.1)' }} />
    <img src="/assets/mockups/explore-1.png" alt="Fuzzy Search & Explore View" style={{ height: '380px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.1)' }} />
    <img src="/assets/mockups/details-pois-1.png" alt="POI Details Overview" style={{ height: '380px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.1)' }} />
  </div>
</div>

## Documentation Portal

Explore our comprehensive, domain-driven documentation. Each section is designed to provide deep technical insights and operational guidance.

**[Visit the Documentation Portal](https://lattice-product-team.github.io/app_lattice_project/)**

| Domain           | Key Areas           | Description                                      |
| :--------------- | :------------------ | :----------------------------------------------- |
| **Product**      | Vision, Roadmap     | Market objectives and long-term strategy.        |
| **Architecture** | System Design, ADRs | Technical blueprint and architectural decisions. |
| **API Spec**     | RESTful Contracts   | Shared data schemas and service interfaces.      |
| **Engineering**  | Standards, Workflow | Coding guidelines and developer productivity.    |
| **Guides**       | Onboarding, Ops     | Step-by-step manuals for users and devs.         |

---

## Quick Start

**IMPORTANT**: Ensure you have **Docker**, **Node.js (v18+)**, and **pnpm (v8+)** installed.

1.  **Dependencies**: `pnpm install`
2.  **Infrastructure**: `docker-compose up -d`
3.  **Database**: `pnpm --filter @app/db db:migrate && pnpm --filter @app/db db:seed`
4.  **Launch**: `pnpm dev` (Starts API, Admin Web, and Mobile)

---

## Technology Stack

- **Backend**: Node.js (Express) with **Drizzle ORM**.
- **Database**: PostgreSQL + **PostGIS** for geospatial optimization.
- **Mobile**: React Native (Expo) with **MapLibre GL** for 60fps mapping.
- **Admin**: Next.js 14 with high-density operational dashboards.
- **Auth**: Custom JWT authentication with bcrypt password hashing.
- **Tooling**: Turborepo, Docker, and Vitest.

## Shared Packages

- `@app/db`: SSOT for schema and migrations.
- `@app/types-schema`: Universal TypeScript definitions.
- `@app/core`: Shared utilities and middleware.
- `@app/theme`: Visual DNA for all platforms.

---

## Contributing

We follow **Conventional Commits**. Please review our **Git Standards** before opening a Pull Request.
