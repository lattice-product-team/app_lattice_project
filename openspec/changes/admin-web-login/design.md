## Context

The `admin-web` application is a Next.js 15 project using the App Router. Currently, all routes are public. To ensure security, we must implement a centralized authentication mechanism. Since the system is designed for a single administrator, we can leverage environment-based credentials and native Next.js features (Middleware, Server Actions, Cookies) to provide a secure and efficient solution.

## Goals / Non-Goals

**Goals:**
- Implement a secure login page (`/login`).
- Protect all administrative routes using Next.js Middleware.
- Manage sessions via secure, HTTP-only JWT cookies.
- Support administrative logout.
- Maintain consistency with the existing Lattice design system.

**Non-Goals:**
- Multi-user support or role-based access control (RBAC).
- Database-backed user management for admins.
- Password reset or "forgot password" flows (managed via environment variables).

## Decisions

### 1. Authentication Strategy: Next.js Middleware + Server Actions
- **Decision**: Use Next.js Middleware for route protection and Server Actions for authentication logic.
- **Rationale**: This is the modern, idiomatic way to handle auth in Next.js App Router. It avoids the overhead of external libraries like `next-auth` for a single-user scenario while remaining highly secure.
- **Alternatives**: 
    - `next-auth`: Overkill for a single admin; requires more boilerplate.
    - Client-side checks: Insecure; content flashes before redirect.

### 2. Session Management: JWT in HTTP-only Cookies
- **Decision**: Sign a JWT with a `JWT_SECRET` and store it in an HTTP-only, secure cookie.
- **Rationale**: Protects against XSS (HTTP-only) and ensures the session can be verified on the server (Middleware/Server Actions) without extra database hits.
- **Alternatives**: 
    - Session ID + Database: Unnecessary complexity for one user.
    - LocalStorage: Insecure; vulnerable to XSS.

### 3. Route Organization: Route Groups
- **Decision**: Use `(admin)` and `(auth)` route groups in the `app` directory.
- **Rationale**: Allows us to have different layouts (one with Sidebar for admin, one without for login) without complex conditional logic in a single `layout.tsx`.

## Risks / Trade-offs

- **[Risk]** Hardcoded credentials in `.env` → **Mitigation**: Ensure `.env` is never committed and credentials are rotated if compromised.
- **[Risk]** Session hijacking → **Mitigation**: Use `SameSite=Strict`, `Secure`, and `HttpOnly` flags for the cookie.
- **[Trade-off]** Static credentials mean no "profile management" in UI. This is acceptable given the "Single Admin" requirement.
