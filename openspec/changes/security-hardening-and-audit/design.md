## Context

The current authentication and gateway logic in the Lattice monorepo relies on insecure "mock" implementations. Passwords are stored in plaintext, JWTs are hardcoded strings, and the Gateway lacks standard security middleware. This design addresses these gaps to meet production-ready security standards.

## Goals / Non-Goals

**Goals:**

- Implement cryptographically secure password storage using Bcrypt.
- Implement standard JWT issuance and verification using a shared secret.
- Hardened Gateway configuration (CORS, Helmet, Rate Limiting).
- Maintain compatibility with the current microservice routing.

**Non-Goals:**

- Implementing a full OAuth2/OIDC server (out of scope for initial hardening).
- Migrating to a different database or auth provider.

## Decisions

### 1. Password Hashing with Bcrypt

- **Decision**: Use `bcryptjs` with 10 salt rounds for hashing in the `auth` service.
- **Rationale**: Bcrypt is a proven, adaptive hashing algorithm that is resistant to brute-force and rainbow table attacks.
- **Alternatives**: Argon2 (more secure but requires native bindings which can complicate cross-platform builds in some environments). Bcrypt is sufficient for current requirements.

### 2. JWT Implementation

- **Decision**: Use `jsonwebtoken` with `HS256` (HMAC with SHA-256).
- **Rationale**: HS256 is the standard for symmetric signing and is efficient for microservices sharing a centralized configuration.
- **Secret Management**: A new `JWT_SECRET` will be added to the core configuration schema in `@app/core`.

### 3. Gateway Hardening Middleware

- **Decision**: Integrate `helmet` for security headers, restricted `cors` configuration, and `express-rate-limit` for DDoS/Brute-force protection.
- **Rationale**: These are industry-standard middleware components for Node.js/Express applications.

### 4. Transition Strategy

- **Decision**: Update `auth.utils.ts` in the `auth` service to provide real signing/verification functions while maintaining the signature of existing functions to minimize refactoring in controllers.

## Risks / Trade-offs

- **Risk**: Existing users with plaintext passwords will fail to login after the hashing requirement is enforced.
- **Mitigation**: A "lazy migration" strategy in the login controller: if a user logs in with a password that matches the old plaintext field, hash it and update the database immediately.
- **Risk**: Rate limiting might block legitimate users behind shared IPs (NAT).
- **Mitigation**: Configure sensible defaults (e.g., 100 requests per 15 minutes) and exclude health-check endpoints.

## Migration Plan

1. **Phase 1: Shared Core**: Add `JWT_SECRET` and `BCRYPT_ROUNDS` to `@app/core` config schema.
2. **Phase 2: Auth Service**: Implement `bcrypt` hashing in registration and login. Implement real JWT signing.
3. **Phase 3: Gateway**: Add security middleware and configure CORS origins.
4. **Phase 4: Validation**: Update all integration tests to expect real JWTs and hashed passwords.

## Open Questions

- Should we implement Refresh Tokens now? (Decision: No, stick to access tokens for initial hardening).
- What should be the default JWT expiration? (Recommendation: 24h for mobile, 1h for web admin).
