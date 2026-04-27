## 1. Setup & Cleanup

- [ ] 1.1 Create `packages/db/src/seed-master.ts` as the new unified seeding entry point
- [ ] 1.2 Implement the `TRUNCATE ... CASCADE` logic for `events` table
- [ ] 1.3 Update root `package.json` to include `db:seed` pointing to `seed-master.ts`
- [ ] 1.4 Delete old seed files (`seed-montmelo.ts`, `seed-pedralbes.ts`)

## 2. Event Seeding Implementation

- [ ] 2.1 Implement Nitro GP seeding (Sports category, Montmeló coordinates)
- [ ] 2.2 Implement Neon Nights Festival seeding (Music category, Parc del Fòrum coordinates)
- [ ] 2.3 Implement Quantum Conf seeding (Tech category, Fira Gran Via coordinates)

## 3. Graph & Accessibility Seeding

- [ ] 3.1 Populate POIs for each event with strict `event_id` associations
- [ ] 3.2 Populate navigation nodes and segments for each event
- [ ] 3.3 Add accessibility test cases (stairs vs. ramps) in the Nitro GP graph

## 4. Verification

- [ ] 4.1 Run `npm run db:seed` and verify database state via Drizzle Studio
- [ ] 4.2 Verify that the mobile app correctly displays the 3 events in the discovery carousel
- [ ] 4.3 Test routing within one of the new events to ensure graph isolation works
