## Why

The mobile application still contains legacy references to previous projects ("Muzaic", "cdc") and has inconsistent naming between the product name (Lattice), the URL scheme (mobile), and the bundle identifier. This creates confusion in the codebase and ambiguity in deep linking and branding.

## What Changes

- **Identity Unification**: Change the URL scheme to `lattice` and standardize the Bundle Identifier.
- **Code Sanitization**: Remove all legacy comments and text references to "Muzaic".
- **Route Refactoring**: Move the scanning feature into the main authenticated section for better architectural grouping.
- **Script Cleanup**: Consolidate and clean up package scripts.

## Capabilities

### New Capabilities
- `branding-consistency`: Verification that all user-facing and developer-facing identifiers match the "Lattice" brand.

### Modified Capabilities
- `mobile-navigation`: Updated route map to include the scan feature within the `(main)` stack.

## Impact

- **Deep Linking**: URL schemes will now use `lattice://` instead of `mobile://`.
- **File System**: `app/scan.tsx` will be moved.
- **Native Build**: A small configuration update in `app.json`.
