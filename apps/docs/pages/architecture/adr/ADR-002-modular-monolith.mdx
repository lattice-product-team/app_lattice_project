# ADR-002: Monolithic API with Domain Separation

- **Status**: Accepted
- **Deciders**: Engineering Team
- **Date**: 2024-05-12

## Context and Problem Statement

As the project grows, we need to decide whether to split the backend into microservices or maintain a monolith. The team is small, and speed of delivery is critical.

## Decision Drivers

- **Operational Complexity**: Minimize the number of services to manage and deploy.
- **Code Sharing**: High need for sharing types and logic between different domains (Geo, Auth, Social).
- **Deployment Speed**: Simple CI/CD pipeline.

## Considered Options

1.  **Microservices Architecture**: Separate services for Geo, Auth, and Social.
2.  **Modular Monolith**: A single Express application structured with clear domain boundaries.

## Decision Outcome

Chosen option: **Modular Monolith**, because it allows for rapid development and easy code sharing while keeping operational overhead low. The domains are strictly separated at the folder and router level to allow for a future split if necessary.

### Positive Consequences

- Single deployment target.
- Simplified local development environment (one command to start the backend).
- Zero network latency between domain logic.

### Negative Consequences

- Scaling is all-or-nothing (cannot scale only the Geo service).
- Risk of tight coupling if developers don't respect domain boundaries.

## Pros and Cons of the Options

### Microservices Architecture

- **Good**: Independent scaling and technology choices for each service.
- **Bad**: High operational complexity, difficult cross-service transactions, and duplicated boilerplate.

### Modular Monolith

- **Good**: Easy to refactor, share code, and deploy.
- **Bad**: Potential for a "big ball of mud" if boundaries are not enforced.
