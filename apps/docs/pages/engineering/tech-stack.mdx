import { Callout } from 'nextra/components'

# Technology Stack

Lattice is engineered with a modern, highly optimized, and type-safe technology stack designed to handle real-time geospatial calculations, low-latency client synchronization, and robust high-capacity ticketing operations.

---

## Technology Stack Overview

Our stack is carefully structured across multiple layer boundaries to guarantee extreme type safety and high IO throughput:

| Technology | Category | Primary Purpose | Key Features |
| :--- | :--- | :--- | :--- |
| **TypeScript** | Core Language | End-to-end static type safety | Strict compilation constraints, shared Drizzle entities |
| **Node.js** | Core Runtime | Scalable server runtime environment | Event-driven architecture, high I/O throughput |
| **React / Next.js** | Web Frontend | Web admin dashboard & operations | Nextra documentation engine, React Server Actions |
| **Expo & React Native** | Mobile Client | Native iOS & Android client | Cross-platform performance, hardware GPS/AR bindings |
| **Express.js** | Backend API | Lightweight REST API gateway | Middleware-driven routing, decoupled controller layers |
| **Socket.IO** | Telemetry | Real-time bi-directional messaging | Low-latency telemetry loops, live room isolation |
| **PostgreSQL & PostGIS** | Data Storage | Relational database & spatial mapping | Native PostGIS geometries, GIST indexing, proximity pings |
| **Drizzle ORM** | Data Access | High-performance type-safe ORM | Zero overhead compilation, instant migration tracking |
| **TailwindCSS** | Web Styling | Rapid utility-first UI styling | Curated dark mode configurations, CSS variables |
| **Turborepo** | DevOps Pipeline | Monorepo task orchestration | Global remote compilation cache, parallelized tests |
| **Docker** | Infrastructure | Containerized local environment | Standardized PostgreSQL, Redis, and Valhalla setups |
| **Git** | Version Control | Structured code collaboration | Conventional commits, automated CI/CD triggers |

---

## Core Runtime and Language

### TypeScript
The structural backbone of the entire monorepo. TypeScript is enforced across all apps and shared packages in **Strict Mode** to guarantee:
*   Absolute type safety from database schemas straight to client UI interfaces.
*   Zero compiler bypasses (`any` is prohibited).
*   Automatic compilation checks during continuous integration pipelines.

### Node.js
Our backend monolith runs on the long-term support (LTS) release of **Node.js**, leveraging its asynchronous, event-driven I/O engine to manage thousands of concurrent device telemetry connections.

---

## Frontend Frameworks

### React and Next.js (Web Dashboard)
The admin Command Center is built utilizing **React** orchestrated by **Next.js 14**, taking full advantage of:
*   **React Server Components (RSC)**: Renders static views on the server to reduce JavaScript bundle sizes and accelerate initial page loads.
*   **Server Actions**: Executes secure database mutations and API orchestrations directly from client components.
*   **Nextra Engine**: Renders our technical documentation from markdown source trees.

### Expo and React Native (Mobile App)
The customer-facing application is built on **React Native** and powered by **Expo**:
*   **Performance**: Renders native iOS and Android UI elements at 60fps, utilizing MapLibre GL's GPU hardware bindings.
*   **Hardware Access**: Leverages native hardware modules for high-frequency GPS tracking, compass heading updates, and gyroscope telemetry for Augmented Reality HUD overlays.

---

## Backend & Telemetry Gateways

### Express.js
A modular monolith backend structured on **Express.js**. Controllers manage HTTP requests, validate bodies with **Zod**, and delegate operations to dedicated domain services.

### Socket.IO
Our persistent, real-time messaging gateway. Coordinates private room streams for location sharing between groups and streams active crowd coordinates to the admin dashboard.

---

## Data Architecture

### PostgreSQL and PostGIS
Our primary relational database engine.
*   **PostGIS Ext**: Expands PostgreSQL's capabilities to manage geodetic spatial geometries.
*   **Spatial Indexing**: Leverages **GIST** indices to process polygon intersections and proximity searches in microseconds.

### Drizzle ORM
A thin, zero-overhead TypeScript ORM.
*   **Type Safety**: Infers types directly from Drizzle table columns, eliminating manually declared TypeScript models.
*   **Optimized Queries**: Translates Drizzle commands into raw SQL syntax without introducing runtime translation overhead.

---

## DevOps and Tooling

### Turborepo
Enforces build pipeline constraints, ensuring dependencies compile in the correct order. It caches successful builds, reducing build times.

### Docker
Provides containerized databases, caching layers (Redis), and third-party pathfinding engines (Valhalla) locally, ensuring consistent development environments.

---

## Architectural Rationale

Lattice utilizes this specialized combination of technologies to meet the stringent demands of high-density crowd navigation:

*   **Geospatial Engines over Document Stores**: Document and key-value databases lack native R-Tree indexing. PostGIS WGS 84 calculations run directly inside PostgreSQL's engine, eliminating the need to pull heavy spatial data into Node for calculation.
*   **Zero-Overhead Compile Layers over Heavy ORMs**: Traditional ORMs introduce notable query translation overhead and have poor support for custom PostGIS syntax. Drizzle ORM acts as a zero-overhead compilation layer, enabling sub-millisecond query execution.
*   **Persistent WebSockets over Long-Polling**: Streaming crowd telemetry coordinates requires a persistent, bi-directional connection. Socket.IO provides low-latency communication with built-in connection restoration and backpressure buffers.
*   **Shared Code over Multi-Platform Teams**: Maintaining separate Swift and Android codebases increases coordination overhead. React Native and Expo allow for a single shared codebase while preserving native performance.

<Callout type="info">
  Every technology in our stack is strictly open-source, features strong TypeScript integration, and supports local Docker replication.
</Callout>
