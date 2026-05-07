## ADDED Requirements

### Requirement: Database-Linked Integration Tests

Backend services SHALL support integration tests that execute against a real PostgreSQL/PostGIS database instance instead of mocks.

#### Scenario: Successful database interaction in tests

- **WHEN** an integration test executes a query using Drizzle ORM
- **THEN** the query MUST succeed against the provided DATABASE_URL environment variable without requiring manual mocking of the database connection.

### Requirement: Automated Test Data Isolation

The testing framework MUST provide a mechanism to isolate data between individual test cases when using a real database.

#### Scenario: Clean state before each test

- **WHEN** a test file begins its execution loop
- **THEN** it SHALL use a `beforeEach` hook to truncate all tables, ensuring no data remains from previous test runs.
