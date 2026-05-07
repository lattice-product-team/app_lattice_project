## ADDED Requirements

### Requirement: Subpath Routing for Web Applications

The web applications MUST support being served from a subpath (e.g., `/lattice/web-admin`) by correctly prefixing all internal links, API requests, and asset URLs.

#### Scenario: Navigating in subpath

- **WHEN** the `admin-web` application is loaded at `projects.kore29.com/lattice/web-admin/`
- **THEN** it MUST correctly load its CSS/JS assets from `/lattice/web-admin/_next/static/...` instead of root.

### Requirement: API Prefixing for Gateway

The Gateway service SHALL support an optional base path prefix (e.g., `/lattice/api`) to facilitate routing through a shared NGINX proxy.

#### Scenario: API request via proxy

- **WHEN** a request is sent to `projects.kore29.com/lattice/api/auth/login`
- **THEN** the Gateway MUST correctly route this to the authentication service, accounting for the `/lattice/api` prefix if it is not stripped by the proxy.
