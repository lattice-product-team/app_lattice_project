## ADDED Requirements

### Requirement: 3-State Snap Logic
La isla flotante DEBE soportar exactamente tres estados de altura (Snap Points) para proporcionar una progresión de contenido clara.
- **Compacto**: Altura fija de 64px (solo el buscador).
- **Descubrimiento (Medio)**: Altura del 45% de la pantalla (dashboard de descubrimiento).
- **Completo (Expandido)**: Altura del 85% de la pantalla (lista detallada).

#### Scenario: Snapping to medium height
- **WHEN** el usuario arrastra la isla hacia arriba desde el estado compacto más allá de un umbral de 50px.
- **THEN** la isla DEBE animarse suavemente hacia el punto de anclaje del 45%.

#### Scenario: Snapping to full height
- **WHEN** el usuario arrastra la isla hacia arriba desde el estado medio.
- **THEN** la isla DEBE anclarse al 85% de la pantalla.

### Requirement: Gesture-Based Fluid Tracking
La isla DEBE seguir el movimiento del dedo del usuario en tiempo real sin latencia perceptible.

#### Scenario: Real-time tracking
- **WHEN** el usuario mantiene el dedo sobre la cabecera de la isla y lo desplaza verticalmente.
- **THEN** la altura de la isla DEBE actualizarse inmediatamente siguiendo el desplazamiento del dedo.
