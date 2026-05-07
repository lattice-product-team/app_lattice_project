## ADDED Requirements

### Requirement: Strict CORS Policy
The API Gateway SHALL enforce a strict Cross-Origin Resource Sharing (CORS) policy that only permits requests from allowed origins (e.g., the Admin web app and Mobile app domains).

#### Scenario: Request from unauthorized origin
- **WHEN** a request is made from a domain not in the whitelist
- **THEN** the Gateway SHALL block the request with a CORS error

### Requirement: Standard Security Headers
The API Gateway SHALL implement standard security headers (Helmet) including X-Content-Type-Options, X-Frame-Options, and Content-Security-Policy where applicable.

#### Scenario: Security Headers Verification
- **WHEN** any response is sent from the Gateway
- **THEN** the headers MUST include X-Frame-Options: DENY and other Helmet defaults

### Requirement: Auth Rate Limiting
The API Gateway SHALL implement rate limiting on all authentication-related endpoints (`/api/v1/auth/*`) to mitigate brute-force attacks.

#### Scenario: Brute-force protection
- **WHEN** an IP address exceeds the configured threshold of login attempts (e.g., 5 per minute)
- **THEN** the Gateway SHALL return a 429 Too Many Requests error
