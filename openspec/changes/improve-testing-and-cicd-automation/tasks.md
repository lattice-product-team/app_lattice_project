## 1. CI/CD Infrastructure Updates

- [x] 1.1 Update `.github/workflows/deploy-backend.yml` to trigger `quality` job on Pull Requests to `dev`.
- [x] 1.2 Update `.github/workflows/deploy-backend.yml` to trigger `deploy` job only on push to `main`.
- [x] 1.3 Ensure `NODE_ENV=test` and `DATABASE_URL` are correctly passed to the `quality` job.

## 2. Backend Real DB Testing

- [x] 2.1 Create a utility in `@app/db` or as a standalone script to handle database truncation for tests.
- [x] 2.2 Implement a sample real database integration test in `apps/server/auth/__tests__/auth.real.integration.test.ts`.
- [x] 2.3 Update `apps/server/auth/package.json` to ensure `vitest` runs without mocks for integration tests.
- [x] 2.4 Verify that real DB tests fail correctly when database constraints are violated.

## 3. Admin Web Testing Setup

- [x] 3.1 Install `vitest`, `@vitejs/plugin-react`, `jsdom`, and `@testing-library/react` in `apps/admin-web`.
- [x] 3.2 Configure `apps/admin-web/vitest.config.ts` with React and JSDOM support.
- [x] 3.3 Create `apps/admin-web/src/test/setup.ts` to include Jest-DOM matchers.
- [x] 3.4 Add an initial "smoke test" in `apps/admin-web/src/__tests__/basic.test.tsx`.
- [x] 3.5 Update `apps/admin-web/package.json` with `test` and `test:watch` scripts.
