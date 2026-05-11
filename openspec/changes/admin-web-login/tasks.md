## 1. Setup and Environment

- [ ] 1.1 Add `jose` for JWT handling in `apps/admin-web/package.json`
- [ ] 1.2 Define `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` in `.env` (verify against `.env.example`)
- [ ] 1.3 Create `apps/admin-web/src/lib/auth.ts` for JWT signing and verification

## 2. Structural Routing Changes

- [ ] 2.1 Create `(admin)` route group and move existing `app` contents (except `favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx`, `providers.tsx`) into it
- [ ] 2.2 Create `(auth)` route group for the login flow
- [ ] 2.3 Refactor `apps/admin-web/src/app/layout.tsx` to be a minimal root layout
- [ ] 2.4 Create `apps/admin-web/src/app/(admin)/layout.tsx` with the existing Sidebar and Providers

## 3. Authentication Implementation

- [ ] 3.1 Create `apps/admin-web/src/app/actions.ts` with `login` and `logout` Server Actions
- [ ] 3.2 Implement `apps/admin-web/src/middleware.ts` for route protection
- [ ] 3.3 Create `apps/admin-web/src/app/(auth)/login/page.tsx` with the editorial-style login form

## 4. UI Refinement and Logout

- [ ] 4.1 Add a Logout button/link to `apps/admin-web/src/components/sidebar-nav.tsx`
- [ ] 4.2 Verify the "Waldenburg" typography and editorial aesthetic on the login page
- [ ] 4.3 Test the full flow: Redirect to login -> Successful Login -> Dashboard -> Logout -> Redirect to login
