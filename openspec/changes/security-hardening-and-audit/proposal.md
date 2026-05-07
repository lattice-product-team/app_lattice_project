## Why

The current authentication system is using plaintext password storage and insecure, non-cryptographic "mock" JWT tokens. This creates a critical security vulnerability that prevents safe production deployment and risks total user data compromise.

## What Changes

- **BREAKING**: Replace plaintext password storage with `bcrypt` (Salted SHA-256) hashing in the `auth` service.
- **BREAKING**: Transition from static mock tokens to cryptographically signed JWTs using a secure environment-provided secret.
- **BREAKING**: Update the API Gateway to enforce strict CORS policies and security headers (Helmet).
- Implement rate limiting at the Gateway level to prevent brute-force attacks on auth endpoints.
- Update all backend tests to validate cryptographic integrity rather than mock string matches.

## Capabilities

### New Capabilities

- `backend-security-hardening`: Technical requirements for password hashing, JWT signing, and secure session management.
- `api-gateway-hardening`: Infrastructure requirements for CORS, security headers, and rate limiting.
- `security-verification-suite`: Test requirements to ensure no security regressions occur during future development.

### Modified Capabilities

- `email-auth-flow`: Update requirements to explicitly state that credentials must be handled securely and tokens must be signed.

## Impact

- **Services**: `apps/server/auth`, `apps/server/gateway`, and `@app/core`.
- **Database**: The `users` table `passwordHash` column will now contain Bcrypt hashes instead of raw passwords.
- **Mobile App**: Must handle real JWT expiration and potentially refresh logic if implemented.
- **CI/CD**: Build secrets must include `JWT_SECRET`.
