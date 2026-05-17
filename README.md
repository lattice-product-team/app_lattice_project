<div align="center">
  
  # Lattice
  
  **The definitive ecosystem for urban discovery and festival management in Barcelona.**
  
  *Built with a high-performance Modular Monolith architecture within a Turborepo.*
</div>

<div align="center">
  <img src="/assets/mockups/main-3.png" alt="Lattice Mobile Platform Showcase" style={{ width: '100%', maxWidth: '780px', borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', margin: '20px 0', border: '1px solid rgba(255,255,255,0.08)' }} />
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

**IMPORTANT**: Ensure you have **Docker**, **Node.js (v20+)**, and **pnpm (v10+)** installed.

The fastest way to set up your environment is using our automated onboarding script:

```bash
pnpm install
pnpm onboard
```

This command will:
1. Verify your environment (Docker, pnpm, Node).
2. Initialize your `.env` file.
3. Start the infrastructure (PostgreSQL, Redis, Valhalla).
4. Run migrations and seed the database.

Once complete, start the project with:
```bash
pnpm dev
```

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
