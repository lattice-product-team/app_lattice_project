## ADDED Requirements

### Requirement: Navigation Layer Support
The map interface SHALL support rendering a specialized "Navigation Layer" for route lines.
- **Style**: Thick blue line with semi-transparent casing.
- **State**: The layer MUST only be visible when a route is active in the `navigationStore`.

### Requirement: 2D Directional Puck
The map interface SHALL replace the standard user location marker with a 2D directional puck when Active Navigation is enabled.
- **Rotation**: MUST rotate in real-time based on the device's course/heading.
