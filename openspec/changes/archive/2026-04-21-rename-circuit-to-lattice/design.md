# Design: Rename "Circuit" to "Lattice"

## Infrastructure (Database)

- Rename `circuit_db` to `lattice_db` in `docker-compose.yml`.
- Update connection strings in `packages/db/drizzle.config.ts` and `packages/db/src/index.ts`.
- Ensure any `pg_isready` checks in Docker are updated.

## Mobile Application

- `app.json`: Update name, displayName, and location permission messages.
- `zrok-tunnel.sh`: Update script output to "Lattice Mobile".
- UI Components:
  - `apps/mobile/src/components/ui/TicketCard.tsx`: Change "CIRCUIT ELITE" to "LATTICE ELITE".
  - `apps/mobile/src/components/ar/ARHUD.tsx`: Change "SCANNING CIRCUIT…" to "SCANNING LATTICE…".
  - `apps/mobile/app/(auth)/welcome.tsx`: Update welcome message while keeping the location "Circuit de Barcelona-Catalunya".
  - `apps/mobile/app/(auth)/login.tsx` & `(auth)/register.tsx`: Update text (e.g., "pilot profile" to "Lattice profile", "race data" to "Lattice data").

## Project Metadata

- `README.md`: Update all references to "Circuit Copilot" to "Lattice".
- `packages/types-schema/index.ts`: Update header comments.

## Strategy

1.  **Preparation**: Back up any local database data.
2.  **Infrastructure Update**: Modify `docker-compose.yml` and database configurations.
3.  **App Configuration Update**: Modify `app.json` and scripts.
4.  **UI Content Update**: Update text in React components.
5.  **Documentation Update**: Update `README.md`.
6.  **Verification**: Rebuild the containers, restart the app, and run `grep` to ensure no unwanted strings remain.
