## Why

Actualmente, el Nivel 3 del bottom sheet se alcanza mediante scroll manual, lo cual interfiere con la experiencia de descubrimiento (donde el Nivel 2 es el estado ideal). Además, la animación y el estilo actual del Nivel 3 no proporcionan la sensación de "foco" necesaria para detalles de eventos o resultados de búsqueda.

Este cambio busca:

1. Limitar el scroll manual hasta el Nivel 2.
2. Reservar el Nivel 3 para contenido específico y detallado, activado solo por acciones del usuario.
3. Refinar la estética del Nivel 3 para que sea pantalla completa (con "gap" superior y sin márgenes laterales).

## What Changes

- **Restricción de Scroll**: El gesto de arrastre (pan/scroll) del usuario ahora tendrá como límite superior el Nivel 2. El Nivel 3 no será alcanzable mediante gestos de arrastre desde el Nivel 1 o 2.
- **Activación Explícita del Nivel 3**: El Nivel 3 se activará únicamente bajo dos condiciones:
  - Selección de un Evento o POI (Point of Interest).
  - Interacción con la barra de búsqueda (focus o submit).
- **Estética del Nivel 3**:
  - Pantalla completa con un pequeño margen superior ("safe area" visual).
  - Sin márgenes laterales (ancho 100%).
  - Estilo "Apple-style" o similar que denote profundidad.
- **Gestión de Foco**: El teclado debe cerrarse y el buscador debe perder el foco al pulsar en cualquier área externa al input (mapa, fondo oscurecido, etc.).
- **Transición de Retorno**: Al deseleccionar el contenido o pulsar "atrás", el sheet debe volver progresivamente al Nivel 2 (el estado de descubrimiento) en lugar de cerrarse o saltar a otros niveles.

## Capabilities

### New Capabilities

- `contextual-full-screen-detail`: Capacidad de transicionar el sheet a un estado de pantalla completa condicional y manejar el retorno al estado previo (Nivel 2).

### Modified Capabilities

- `map-discovery-level-2`: Se modifica el comportamiento de los gestos para bloquear el acceso manual al Nivel 3.

## Impact

- `apps/mobile`: Modificación en la lógica del componente `BottomSheet` y sus controladores de gestos.
- Navegación: Cambios en cómo se maneja el estado del mapa al entrar/salir del Nivel 3.
