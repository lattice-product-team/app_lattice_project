# Tasks: Rename "Circuit" to "Lattice"

## Task 1: Infrastructure and Database Configuration

- [x] Rename `circuit_db` to `lattice_db` in `docker-compose.yml`.
- [x] Update connection URL in `packages/db/drizzle.config.ts`.
- [x] Update default database name in `packages/db/src/index.ts`.
- [x] Verify Docker container health check command in `docker-compose.yml`.

## Task 2: Mobile App Configuration

- [x] Update `name` and `displayName` in `apps/mobile/app.json`.
- [x] Update location permission strings in `apps/mobile/app.json`.
- [x] Update echo message in `apps/mobile/zrok-tunnel.sh`.

## Task 3: UI Content Updates

- [x] Change "CIRCUIT ELITE" in `apps/mobile/src/components/ui/TicketCard.tsx`.
- [x] Change "SCANNING CIRCUIT…" in `apps/mobile/src/components/ar/ARHUD.tsx`.
- [x] Update welcome text in `apps/mobile/app/(auth)/welcome.tsx`.
- [x] Update text in `apps/mobile/app/(auth)/login.tsx` ("pilot profile", "race data").
- [x] Update text in `apps/mobile/app/(auth)/register.tsx` ("elite crew", "race analytics").

## Task 4: Documentation and Metadata

- [x] Update "Circuit Copilot" references in `README.md`.
- [x] Update header comment in `packages/types-schema/index.ts`.

## Task 5: Verification

- [x] Run `grep -ri "circuit" .` and `grep -ri "race" .` to identify any missed references.
- [x] Ensure the app builds and runs correctly.
