## ADDED Requirements

### Requirement: Standardized Async Auth Side-Effects

All authentication side-effects (Claiming, Unclaiming, Syncing) SHALL be managed via TanStack Query mutations and queries to provide consistent loading and error states across the UI.

#### Scenario: Claiming a ticket

- **WHEN** the `useClaimTicket` mutation is executed
- **THEN** the system SHALL provide an `isPending` state and automatically invalidate the `user-tickets` query upon success.

#### Scenario: Syncing wallet

- **WHEN** the `user-tickets` query is executed
- **THEN** the system SHALL fetch data from the API and allow components to react to `isLoading` states.
