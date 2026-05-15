## 1. Prepare Seed Data

- [x] 1.1 Create a JSON file containing the rich seed data (6-8 events, ~30 clustered POIs).
- [x] 1.2 Use placeholder image URLs as discussed (e.g., `https://PLACEHOLDER.COM/IMAGE_...`).
- [x] 1.3 Assign coordinates centered around the current testing area.

## 2. Implement Seeding Logic

- [x] 2.1 Update the backend seed script (e.g., `prisma/seed.ts`) to read and inject the new data.
- [x] 2.2 Implement a data clearing phase to ensure a fresh state.

## 3. Execution and Verification

- [x] 3.1 Run the seed command (e.g., `docker compose exec api npm run seed`).
- [ ] 3.2 Verify the new events appear in the Discovery Feed with their respective categories.
- [ ] 3.3 Verify the map shows clusters of POIs around the event locations.
- [ ] 3.4 Confirm the star ratings and new "CONSULTA MÁS DETALLES" buttons work with the new data.
