## ADDED Requirements

### Requirement: Web Application Testing Infrastructure

The `admin-web` project SHALL include a configured testing environment using Vitest and React Testing Library.

#### Scenario: Running component tests

- **WHEN** the command `pnpm test` is executed within the `admin-web` directory
- **THEN** it MUST execute all `.test.tsx` and `.spec.tsx` files and report the results.

### Requirement: DOM Testing Environment

The web testing suite MUST support a simulated browser environment (jsdom) for rendering and interacting with React components.

#### Scenario: Component rendering validation

- **WHEN** a React component is rendered using `render()` from `@testing-library/react`
- **THEN** the test MUST be able to query the DOM for elements and assert their presence or behavior.
