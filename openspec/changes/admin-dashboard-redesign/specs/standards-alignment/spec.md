## ADDED Requirements

### Requirement: Admin Web HeroUI v3 Standards
The Admin Web application SHALL strictly adhere to HeroUI v3's compound component architecture and Tailwind v4 styling patterns. This includes using `<Table.ScrollContainer>` and `<Table.Content>` for all tables, and utilizing `rounded-full` buttons for primary actions to match the brand identity established in `@app/theme`.

#### Scenario: Table Component Compliance
- **WHEN** a developer implements a new table in the Admin Web
- **THEN** it MUST use the compound component structure (ScrollContainer > Content > Header/Body) to prevent React Aria runtime errors.

#### Scenario: Button Styling Consistency
- **WHEN** a primary action button (e.g., Create, Save, Invite) is rendered on the dashboard
- **THEN** it MUST use `color="primary"`, `variant="solid"`, and `className="rounded-full"` to ensure a unified and premium aesthetic.
