## Context

The current `admin-web` dashboard serves as a generic placeholder with data that does not reflect the operational nature of the Lattice platform. The project is currently transitioning to HeroUI v3 and Tailwind v4, providing an opportunity to align the primary entry point with the core product mission: managing high-density events through location intelligence and real-time telemetry.

## Goals / Non-Goals

**Goals:**
- Replace generic "Good morning, Kate" greeting with an event-centric live status header.
- Implement an operational summary using HeroUI `<Card>` components for telemetry KPIs.
- Replace sales charts with event-relevant inflow and density visualizations.
- Refactor the main data table from "Workers" to "Gate & Access Point Status".
- Ensure 100% compliance with HeroUI v3 compound component architecture for all updated elements.

**Non-Goals:**
- Integrating real-time WebSocket logic (this design focuses on UI/UX structure and static data binding/mocking).
- Redesigning the sidebar or global layout (out of scope for this task).
- Adding backend endpoints for the new metrics (dashboard will use local mock data consistent with `packages/db` schema for now).

## Decisions

### 1. Component Structure: Operational Cards
**Rationale:** Administrators need to see the "health" of the event at a glance. We will use three high-contrast cards at the top of the dashboard.
**Rationale for HeroUI:** Using `<Card>` with `variant="flat"` and custom background opacities to maintain the "Hybrid" aesthetic (opaque data, glass accents).

### 2. Visualization: Spectator Inflow (Bar Chart)
**Rationale:** Replaces "Total Sales". A bar chart is the most effective way to show hourly entry rates.
**Implementation:** Use the existing SVG-based bar chart component but map it to a `time-series` data array representing hours of the day (e.g., 08:00 - 14:00).

### 3. Data Refactoring: Gate Status Table
**Rationale:** Replaces "Employees Table". Gates are the primary bottleneck in event management.
**Table Columns:** `Gate ID`, `Location`, `Current Load` (Chip-based), `Wait Time`, `Status` (Switch/Chip).
**Pattern:** Strict adherence to `Table.ScrollContainer > Table.Content > Table.Header / Table.Body`.

### 4. Iconography: Contextual Mapping
**Rationale:** Using the newly updated `Icons` object in `src/components/icons.tsx`.
- `Users`: Active Spectators
- `Bell`: Incident Alerts
- `Ticket`: (To be added if missing, or use `List`) Claimed Tickets
- `MapPin`: Gate Locations

## Risks / Trade-offs

- **[Risk] Data Mocking** → **Mitigation**: Ensure all mocked data types (e.g., `Gate`, `InflowData`) match the structures in `packages/db/schema.ts` to simplify future API integration.
- **[Risk] Responsive Complexity** → **Mitigation**: Use Tailwind's grid system (`grid-cols-1 lg:grid-cols-3`) to ensure the three overview cards and two charts stack correctly on smaller screens.
- **[Risk] HeroUI v3 Runtime Errors** → **Mitigation**: Rigorous validation of compound component nesting in `page.tsx`.
