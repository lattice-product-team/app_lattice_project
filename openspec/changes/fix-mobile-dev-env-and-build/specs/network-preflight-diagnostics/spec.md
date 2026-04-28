## ADDED Requirements

### Requirement: External Connectivity Validation
The system SHALL provide a diagnostic tool to verify that the MacBook's local network ports (Metro 8081 and Gateway 3000) are reachable from external devices on the same network interface.

#### Scenario: Successful Connectivity Check
- **WHEN** the diagnostic tool is run
- **THEN** it verifies the active IP and successfully probes the required ports, reporting "All systems ready".

#### Scenario: Firewall or Isolation Detected
- **WHEN** a probe to a required port fails on the external IP but succeeds on localhost
- **THEN** the system MUST display a clear warning message suggesting the user check their macOS Firewall or Personal Hotspot settings.
