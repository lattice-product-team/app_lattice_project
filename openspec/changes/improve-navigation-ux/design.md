## Context

El sistema de navegación actual utiliza una integración directa entre la selección de un punto de interés (POI) y el inicio de la navegación. Esto limita la flexibilidad del usuario y crea una experiencia de "conducción" ruidosa debido a la persistencia de elementos de búsqueda en pantalla.

## Goals / Non-Goals

**Goals:**
- Desacoplar el inicio de la navegación mediante un `RoutePlanningSheet`.
- Implementar un modo de navegación "limpio" que oculte elementos de UI no relacionados.
- Añadir un control de recentrado manual explícito durante la navegación.
- Mejorar la precisión visual del puntero de usuario.
- Soportar el modo de transporte bicicleta.

**Non-Goals:**
- Implementar recalculo de rutas en tiempo real (fuera de alcance para esta fase).
- Cambiar el motor de renderizado de mapas.

## Decisions

- **UI Isolation**: Se utilizará el estado `isNavigating` de `useNavigationStore` para condicionar la renderización de la barra de búsqueda y los controles HUD. Esto centraliza la lógica de "modo conducción" en el estado global.
- **Centering Logic**: Se usará el estado `isFollowingUser` de `useMapUIStore`. El componente `MapContent` detectará interacciones del usuario y establecerá este flag a `false`. El botón `CenteringButton` será el único encargado de devolverlo a `true`.
- **Route Planner**: Se implementará como un componente animado con `react-native-reanimated` que consumirá el `navigationService` para pre-cargar los tiempos estimados de los 3 modos de transporte.
- **Heading Indicator**: Se aprovechará `showsUserHeadingIndicator` de `MapLibreGL.UserLocation` si es posible, o se implementará un `MarkerView` personalizado que escuche los cambios de orientación si se requiere un diseño más específico.
- **Bicycle Support**: Se mapeará el modo `cycling` a la opción de coste `bicycle` de Valhalla en el `navigationService`.

## Risks / Trade-offs

- **[Risk] Latencia en el Planificador** → **[Mitigación]** Mostrar esqueletos de carga (skeletons) mientras Valhalla devuelve los tiempos para los 3 modos de transporte.
- **[Risk] Conflicto de Gestos** → **[Mitigación]** Asegurar que el botón de Centrar tiene un `zIndex` superior a los elementos interactivos del mapa pero inferior a los modales de llegada.
