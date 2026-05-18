import { Callout } from 'nextra/components'

# Developer Onboarding

Welcome to the **Lattice Engineering Team**! We are excited to have you join us in building the most advanced location-aware event discovery and navigation ecosystem. 

This guide outlines your onboarding path, detailing your setup requirements, operational resources, and your first-week checklist.

---

## 1. Initial Setup Checklist

To get your local development workspace fully configured:

1.  **Follow the Getting Started Guide**: Complete the environment and database setup outlined in the **[Getting Started & Installation Guide](./getting-started.md)** to launch all core services in under 5 minutes.
2.  **IDE Standardization**: Configure your local editor (such as VS Code) with the project's **ESLint** and **Prettier** rules to maintain formatting consistency.
3.  **Review the Engineering Standards**: Carefully review our **[Coding Standards](../engineering/coding-standards.md)** and **[Git & Collaboration Guidelines](../engineering/git-standards.md)**.
4.  **Understand the Architecture**: Read the **[System Overview](../architecture/index.md)** and **[Monorepo Structure Architecture Guide](../architecture/monorepo-structure.md)** to learn how shared packages communicate with server and client applications.

---

## 2. Your First Week Schedule

Our onboarding process is structured to help you make your first production contribution by the end of your first week:

### Day 1: Workspace and Initialization
*   Clone the repository, configure your `.env` parameters, and launch the local stack using `pnpm onboard`.
*   Verify API, Web Dashboard, and Mobile metro bundlers are fully operational.

### Day 2: Architecture & Domain Review
*   Read the **[System Architecture](../architecture/index.md)** and the **[API Reference Specifications](../api-spec/index.md)**.
*   Explore the database schema layouts and PostGIS spatial queries.

### Day 3: Codebase Walkthrough
*   Inspect the Express server route configurations inside `apps/server/api/src`.
*   Explore the custom React Native map wrappers and geolocation stores in `apps/mobile/src`.

### Day 4: Select a Backlog Task
*   Log into our task board and select a lightweight backlog issue or a documented feature hotfix.
*   Discuss your proposed implementation approach in our collaboration channels.

### Day 5: Open Your First Pull Request
*   Open your development branch following conventional commit rules.
*   Ensure all linting, formatting, and unit testing scripts pass locally.
*   Open a Pull Request and request peer reviews from the core team.

---

## 3. Communication & Operational Channels

Stay connected with our coordinators and track developmental tasks:

*   **Engineering Lead Contacts**:
    *   Martí Castano: `marticastanorodriguez@gmail.com`
    *   Nil Díaz: `nildiazbel@inspedralbes.cat`
*   **Active Backlog Management**: [Taiga Project Timeline Workspace](https://tree.taiga.io/login?unauthorized=true&next=%2Fproject%2Fkore29-dam_25_26_tr3g3_cdc%2Ftimeline)

<Callout type="info">
  **Engineering Support**: If you encounter environment setup issues, feel free to reach out directly to the coordinators or ask a question in the development channels. We are here to support your engineering journey!
</Callout>
