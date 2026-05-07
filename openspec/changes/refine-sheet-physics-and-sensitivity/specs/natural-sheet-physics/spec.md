## ADDED Requirements

### Requirement: Seguimiento 1:1 de Gestos

El sistema DEBE asegurar que el panel se desplace en sincronía directa con el dedo del usuario durante un gesto de arrastre (pan). El factor de escala entre el desplazamiento del dedo (en píxeles) y el cambio de estado del panel (0.0 a 1.0) DEBE ser exacto respecto a la distancia física entre los puntos de anclaje (snap points).

#### Scenario: Arrastre ascendente preciso

- **WHEN** el usuario arrastra el panel hacia arriba una distancia de 200px
- **THEN** el panel DEBE desplazarse exactamente 200px hacia arriba sin aceleraciones adicionales

### Requirement: Sensibilidad Balanceada a la Velocidad

El sistema DEBE aplicar un factor de inercia reducido al calcular la posición final del panel basándose en la velocidad del gesto al soltar. El cálculo de la posición proyectada DEBE priorizar el punto de anclaje más cercano a menos que se detecte un gesto de "flick" rápido y deliberado.

#### Scenario: Soltado sin inercia excesiva

- **WHEN** el usuario suelta el panel con una velocidad baja o moderada
- **THEN** el panel DEBE anclarse al nivel (Snap Point) más cercano a la posición actual del dedo

### Requirement: Física de Muelle Premium

El sistema DEBE utilizar una configuración de muelle unificada que proporcione una sensación de peso y suavidad. Esta configuración DEBE minimizar el rebote (overshoot) y asegurar una transición fluida entre estados sin vibraciones visuales.

#### Scenario: Transición suave entre niveles

- **WHEN** el panel se ancla a un nuevo nivel después de un gesto
- **THEN** la animación DEBE detenerse de forma suave y precisa en el punto de anclaje objetivo sin rebotar más allá del límite
