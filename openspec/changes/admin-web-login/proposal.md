## Why

The `admin-web` dashboard currently lacks an authentication layer, allowing unrestricted access to sensitive event operations and telemetry data. To secure the Operations Center, we need a robust yet simple login mechanism that restricts access to authorized administrators only.

## What Changes

- **New Login Route**: Implement a standalone `/login` page for `admin-web`.
- **Route Guarding**: Use Next.js Middleware to protect all admin routes, redirecting unauthenticated users to `/login`.
- **Session Management**: Implement secure, HTTP-only cookie-based session management using JWT.
- **Environment-based Credentials**: Use server-side environment variables to store and verify admin credentials.
- **UI/UX Updates**: 
    - Create a minimal, high-aesthetic login interface consistent with the Lattice design language.
    - Organize routes using Next.js Route Groups to separate public and protected layouts.
    - Add a logout mechanism to the sidebar.

## Capabilities

### New Capabilities
- `admin-auth-system`: Secure authentication and session management specifically for the admin-web environment, leveraging server-side validation and secure cookies.

### Modified Capabilities
- `event-operations-dashboard`: Update requirements to include mandatory authentication before accessing any dashboard features.

## Impact

- **apps/admin-web**: Structural changes to routing, new middleware, and authentication logic.
- **Deployment**: New environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`) must be configured.
- **Security**: Significantly improved security posture for administrative tools.
