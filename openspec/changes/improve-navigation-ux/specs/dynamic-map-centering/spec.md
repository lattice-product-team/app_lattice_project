## ADDED Requirements

### Requirement: Botón de Recentrado Dinámico
El sistema SHALL mostrar un botón de "CENTRAR" cuando el usuario desplace el mapa manualmente durante una navegación activa.

#### Scenario: Aparición del botón de centrar
- **WHEN** `isNavigating` es true y el usuario realiza un gesto de pan/zoom que pone `isFollowingUser` en false
- **THEN** aparece un botón con la etiqueta "CENTRAR" en la esquina inferior derecha

#### Scenario: Acción de centrado
- **WHEN** el usuario pulsa el botón "CENTRAR"
- **THEN** el sistema establece `isFollowingUser` a true y el mapa se anima suavemente hasta la posición del usuario
