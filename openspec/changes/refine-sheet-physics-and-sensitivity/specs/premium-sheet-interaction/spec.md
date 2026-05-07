## MODIFIED Requirements

### Requirement: Premium Motion Physics

The sheet transitions MUST utilize a spring physics model that conveys "mass" and "inertia", avoiding excessive bounciness or jitter during rapid gestures. El sistema DEBE asegurar un seguimiento 1:1 entre el dedo y el panel, y los cálculos de inercia DEBEN estar calibrados para evitar saltos accidentales entre niveles de anclaje.

#### Scenario: Smooth Snap Point Transition

- **WHEN** a user releases the sheet after a flick gesture
- **THEN** the sheet MUST settle into the closest snap point with a damping ratio que minimice las oscilaciones y un factor de inercia que respete la intención del usuario sin saltarse niveles intermedios de forma desproporcionada.
