# B - Planning

This section details the project's development lifecycle, including sprint enumeration, task allocation, and testing phases.

## Sprint List

### Sprint 1: MVP Phase (Minimum Viable Product)
- **Objective**: Core infrastructure and basic map navigation.
- **Tasks**:
  - [x] Initial monorepo setup (API, Mobile, Web)
  - [x] Database schema design and implementation
  - [x] Basic map rendering in mobile app
  - [x] User authentication system

### Sprint 2: Core Features
- **Objective**: Event discovery and interactive markers.
- **Tasks**:
  - [x] POI and Event data ingestion
  - [x] Advanced map markers with custom styling
  - [x] Search and filtering logic
  - [ ] AR Navigation prototype

### Sprint 3: Refinement and Polish
- **Objective**: Documentation, final UI polish, and production readiness.
- **Tasks**:
  - [x] Documentation restructuring (A-J template)
  - [ ] Final UI/UX refinements
  - [ ] Performance optimization
  - [ ] Preparation for final pitch

## Testing Phases

Testing is integrated into our CI/CD pipeline to ensure system reliability.

### 1. Automation Pipeline
We use GitHub Actions for continuous integration. Before each deployment, the system executes:
`Lint -> TypeCheck -> Tests`

### 2. Test Execution
- **Full Suite**: `pnpm test`
- **Linting**: `pnpm lint`
- **Type Checking**: `pnpm build`

### 3. Test Categories
- **Logic Tests (Vitest)**: Core algorithms and services.
- **DB Integration (Testcontainers)**: Real queries against ephemeral Postgres containers.
- **UI Tests (Jest + RNTL)**: React Native component rendering and navigation.

### 4. User Testing
*(Details on user testing phases and feedback sessions will be added here)*
