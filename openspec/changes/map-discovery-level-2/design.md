## Context

Tras el hard reset, tenemos una arquitectura de "Isla Flotante" pura en `index.tsx`. El siguiente paso es dotarla de inteligencia de movimiento y contenido estructurado para el Nivel 2 (Descubrimiento). Actualmente solo tenemos un estado binario (Compacto/Expandido) disparado por el foco del input.

## Goals / Non-Goals

**Goals:**
- Implementar un sistema de 3 puntos de anclaje (Snap Points): Compacto (64px), Medio (45%) y Completo (85%).
- Añadir soporte para gestos táctiles (Pan Gesture) que permitan arrastrar la isla.
- Crear un sistema de renderizado de contenido progresivo (el contenido aparece a medida que la isla sube).
- Mantener la sincronización de los controles (AdaptiveControlOverlay) con la altura dinámica.

**Non-Goals:**
- Implementar navegación compleja dentro de la isla (por ahora solo descubrimiento).
- Cambiar la lógica de búsqueda (el input sigue siendo el mismo).

## Decisions

- **Gestión de Gestos con Reanimated 3**: Utilizaremos `GestureDetector` de `react-native-gesture-handler` vinculado a variables compartidas (`SharedValues`). 
  - *Razón*: Permite una respuesta táctil de 60/120fps sin pasar por el puente de JS, esencial para la sensación premium de Apple Maps.
- **Componente DiscoveryDashboard**: Crearemos un nuevo componente que reciba la altura actual de la isla para animar la opacidad de sus hijos.
  - *Razón*: Permite que los filtros y carruseles aparezcan con un "fade" elegante en lugar de un corte brusco.
- **Scroll Independiente**: Solo activaremos el scroll interno de la lista cuando la isla alcance el punto máximo (85%).
  - *Razón*: Evita conflictos de gestos entre el "pull to expand" y el "scroll content".

## Risks / Trade-offs

- **[Conflicto de Gestos]**: El mapa y la isla compiten por el tacto. → *Mitigación*: Usar áreas de golpeo (`hitbox`) claras y priorizar el gesto de la isla en su cabecera.
- **[Rendimiento del Blur]**: Animar un Blur muy grande puede ser costoso. → *Mitigación*: Mantener la intensidad constante y solo animar el tamaño del contenedor.
