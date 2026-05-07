## Why

Los paneles desplegables de la aplicación móvil presentan una sensibilidad excesiva a los gestos del usuario, provocando que el panel se desplace al doble de velocidad que el dedo y se salte niveles intermedios (como el Nivel 2) de forma accidental. Esta falta de control degrada la experiencia de usuario y no cumple con los estándares de fluidez y precisión esperados para una aplicación de navegación premium.

## What Changes

- **Corrección de Divisores de Gestos**: Ajuste de la lógica matemática en `MapIndexPage` y `EventDetailSheet` para asegurar un seguimiento 1:1 entre el movimiento del dedo y el desplazamiento del panel.
- **Recalibración de Sensibilidad a la Velocidad**: Reducción del factor de influencia de la velocidad (inercia) al soltar el panel para evitar saltos de nivel no deseados.
- **Estandarización de Física de Muelle**: Implementación de una configuración de muelle (`SPRING_CONFIG`) unificada, con mayor amortiguación y una rigidez equilibrada para una sensación de peso y control mejorada.
- **Unificación de Comportamiento**: Sincronización de la lógica de gestos entre el buscador principal, la ficha de eventos y la mini-card de POIs.

## Capabilities

### New Capabilities
- `natural-sheet-physics`: Define los requisitos técnicos para una interacción de paneles que siga el movimiento del usuario de forma natural, sin aceleraciones artificiales ni saltos bruscos entre estados.

### Modified Capabilities
- `premium-sheet-interaction`: Se actualizan los requisitos de respuesta táctil y suavidad de movimiento para alinearlos con el nuevo modelo de física 1:1.
- `event-detail-sheet`: Se ajusta la lógica de cierre y expansión para que sea coherente con el buscador principal.

## Impact

- `apps/mobile/app/(main)/index.tsx`: Cambio crítico en la lógica de `Gesture.Pan()`.
- `apps/mobile/src/features/map/components/EventDetailSheet.tsx`: Refactorización de la lógica de gestos personalizada.
- `apps/mobile/src/features/map/components/POIMiniCard.tsx`: Ajuste opcional de la animación de entrada/salida para coherencia visual.
- `apps/mobile/src/features/map/store/useMapUIStore.ts`: Posible adición de constantes de física compartidas.
