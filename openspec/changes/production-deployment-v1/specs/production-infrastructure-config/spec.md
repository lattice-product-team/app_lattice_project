## ADDED Requirements

### Requirement: Self-Hosted Production Runner
The deployment system MUST utilize a GitHub Actions self-hosted runner installed on the production Proxmox VM to execute deployment commands and manage Docker containers locally.

#### Scenario: Deployment on self-hosted runner
- **WHEN** a push to the `main` branch occurs
- **THEN** the `deploy` job MUST execute on the `self-hosted` runner, allowing it direct access to the local Docker engine and filesystem.

### Requirement: External Database Persistence
The production environment SHALL connect to a PostgreSQL database hosted on a dedicated VM (`192.168.1.57`).

#### Scenario: Database connectivity in production
- **WHEN** the `auth` or `geo` services start in production mode
- **THEN** they MUST successfully establish a connection to the database using the credentials provided in the `DATABASE_URL` secret.

### Requirement: Cloudflare Tunnel Integration
The infrastructure SHALL support incoming traffic routed via Cloudflare Tunnels to the local NGINX proxy.

#### Scenario: Traffic routing
- **WHEN** a request arrives at `projects.kore29.com/lattice/api`
- **THEN** it MUST be correctly tunneled to the local network and proxied to the `lattice_gateway` container.
