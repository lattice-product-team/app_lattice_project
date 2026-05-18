import { Callout } from 'nextra/components'

# Guides and Manuals

Welcome to the **Lattice Guides Portal**. This section consolidates detailed step-by-step instructions, administrative playbooks, operational manuals, and troubleshooting guides to help developers and operators get the most out of the Lattice platform.

---

## Developer Onboarding & Installation

For engineers and system administrators setting up the project locally:

*   **[Getting Started & Installation](./getting-started.md)**: The unified setup handbook. Covers local prerequisites, cloning, environment variable configuration, Docker compose setups, database migrations, and active service verifications.
*   **[Developer Onboarding](./onboarding.md)**: Welcome checklist for new developers, mapping out tasks for your first week on the project.
*   **[Troubleshooting Guide](./troubleshooting.md)**: Common environment collisions, Port 5433 database conflicts, React SSR hydration errors, and Android Google Sign-in SHA-1 fingerprint resolutions.

---

## Operational and User Manuals

For event organizers, municipal authorities, safety marshals, and festival attendees:

*   **[Admin User Guide](./admin-user-guide.md)**: Command Center operational handbook. Explains event boundary fencings, POI registrations, live coordinate polling layers, and crowd density heatmap tracking.
*   **[Mobile User Guide](./mobile-user-guide.md)**: Festival attendee companion handbook. Covers authentication pathways, ticket wallets, route planning, and gyroscope-responsive Augmented Reality viewfinders.
*   **[Deployment Guide](./deployment.md)**: Production infrastructure guidelines, database provisioning with PostGIS, building multi-stage Docker images, Nginx reverse-proxies with SSL, and EAS mobile store submissions.

---

<Callout type="info">
  **Architecture Reference**: If you are looking for specific technical diagrams, class structures, or relational models, please refer directly to the **[System Architecture](../architecture/index.md)** portal.
</Callout>
