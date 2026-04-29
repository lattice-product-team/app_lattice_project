## ADDED Requirements

### Requirement: LAN/Hotspot Routing Awareness
The system SHALL ensure that all mobile-facing services (Gateway and Metro) are bound to the active external network interface when in LAN mode, allowing physical devices to connect.

#### Scenario: Mobile Connection via Hotspot
- **WHEN** a physical device is connected via Personal Hotspot
- **THEN** the Metro Bundler and Gateway API MUST be accessible via the MacBook's `bridge100` or `en0` IP address.
