## MODIFIED Requirements

### Requirement: Snap Points para Gestos Manuales

El gesto de arrastre (pan) del usuario SHALL estar limitado a los niveles inferiores para evitar el acceso accidental a la vista de detalle.

#### Scenario: Límite de Arrastre en Nivel 2

- **WHEN** el usuario arrastra la "Island" manualmente hacia arriba
- **THEN** el punto de "snap" más alto disponible debe ser el 0.5 (Nivel 2)
- **THEN** cualquier intento de arrastrar por encima de 0.5 debe resultar en un retorno al punto 0.5 mediante un efecto de spring
