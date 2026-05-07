## MODIFIED Requirements

### Requirement: Google Sign-In
- **Library**: `expo-auth-session/providers/google`
- **Flow**:
    1. User clicks "Continue with Google".
    2. Open Google Auth UI.
    3. Receive `idToken`.
    4. Send `idToken` to Backend `/auth/google`.
    5. After success, redirect to `/(main)` or `intendedDestination`.

#### Scenario: First time Social Login
- GIVEN a user with no Lattice account
- WHEN they sign in with Google
- THEN a new account is created AND they are redirected to the map (`/(main)`).

#### Scenario: Existing Social Login
- GIVEN a user who previously registered with Apple or Google
- WHEN they sign in with that provider again
- THEN they are logged into their existing account AND redirected to the map (`/(main)`).
