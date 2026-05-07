## 1. Environment & Shared Core

- [x] 1.1 Add `JWT_SECRET` and `BCRYPT_ROUNDS` to `BackendEnv` schema in `packages/core/src/config.ts`
- [x] 1.2 Update `.env.example` with the new security variables
- [x] 1.3 Update local `.env` with secure default values for development

## 2. Authentication Hardening

- [x] 2.1 Install `bcryptjs`, `jsonwebtoken` and their types in `apps/server/auth`
- [x] 2.2 Implement `hashPassword` and `comparePassword` in `apps/server/auth/controllers/auth.utils.ts`
- [x] 2.3 Implement real `generateToken` and `verifyToken` using `jsonwebtoken` in `auth.utils.ts`
- [x] 2.4 Update `register` controller to hash passwords before saving
- [x] 2.5 Update `login` controller to use `comparePassword` and implement lazy migration for plaintext passwords
- [x] 2.6 Update all controllers in `auth` service to use real token verification middleware

## 3. Gateway Hardening

- [x] 3.1 Install `helmet`, `cors`, and `express-rate-limit` in `apps/server/gateway`
- [x] 3.2 Configure Helmet with production-ready security headers in `apps/server/gateway/index.ts`
- [x] 3.3 Restrict CORS origins to authorized domains in development and production
- [x] 3.4 Implement rate limiting on all auth-related proxy routes

## 4. Verification & Audit

- [x] 4.1 Update `apps/server/auth/__tests__/auth.integration.test.ts` to verify hashing and signed tokens
- [x] 4.2 Add Gateway security tests to verify headers and CORS enforcement
- [x] 4.3 Audit Mobile app `AuthStore` to ensure compatibility with real JWTs
- [x] 4.4 Run full `pnpm test` suite to ensure system integrity
