## ADDED Requirements

### Requirement: External Proxy Connectivity
All production services SHALL belong to a shared external network (e.g., `red_proxy`) to allow connectivity with the global Nginx proxy.

#### Scenario: Shared network membership
- **WHEN** the production compose file is deployed
- **THEN** all application services MUST be attached to the `red_proxy` network.

## MODIFIED Requirements

### Requirement: Host-Based Service Discovery

Backend services SHALL use environment variables for service hosts (e.g., `AUTH_HOST`, `GEO_HOST`, `SOCIAL_HOST`, `VALHALLA_HOST`) instead of hardcoded strings like `localhost`. In production, these SHALL resolve to explicit container names.

#### Scenario: Production resolution

- **WHEN** the `VALHALLA_HOST` variable is set to `lattice_valhalla` in production
- **THEN** the API service MUST be able to resolve and connect to the Valhalla container via its explicit name.
