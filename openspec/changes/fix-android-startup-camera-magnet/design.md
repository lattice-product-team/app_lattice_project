## Context

En el desarrollo de aplicaciones móviles con React Native, los puentes nativos (como `@maplibre/maplibre-react-native`) son sumamente sensibles a la jerarquía de componentes hijos. En dispositivos Android, anidar componentes compuestos de React (como `<MapCameraManager />`) dentro de una vista nativa (como `<MapLibreGL.MapView />`) provoca problemas de **View Flattening** y reconciliación agresiva.

Esto causa que cada vez que el usuario interactúa o que las coordenadas GPS se actualizan, el puente nativo desmonte y vuelva a montar el componente compuesto en segundo plano. Al desmontarse, todas las referencias internas declaradas vía `useRef` (incluyendo `hasInitialized.current`) se destruyen y reinician, provocando que la aplicación vuelva a ejecutar el efecto de posicionamiento inicial (imán/teletransportación instantánea al usuario sin animación).

## Goals / Non-Goals

**Goals:**

- **Eliminar el Intermediario**: Remover por completo el componente compuesto `<MapCameraManager />` para simplificar la jerarquía.
- **Renderizado Nativo Directo**: Renderizar `<MapLibreGL.Camera />` como un hijo plano directo del componente nativo `<MapLibreGL.MapView />` en `MapContent.tsx`.
- **Estabilización de Referencias**: Mover el control de ciclo de vida, los efectos de la cámara y las referencias de inicialización (`hasInitialized`, `lastIsNavigating`, etc.) directamente al cuerpo de `MapContent.tsx`.
- **Preservación Funcional**: Mantener intactas todas las funcionalidades existentes (seguimiento manual de Android, gestos de liberación de cámara, encuadres de rutas de navegación y enfoques de POIs/eventos).

**Non-Goals:**

- Cambiar la lógica de tracking de ubicación en `useLocationService.ts` o los intervalos de escaneo GPS.
- Modificar el sistema de ruteo de Expo Router o los paneles inferiores deslizables.

## Decisions

### Decision 1: Migración de la Cámara a Hijo Directo de MapView

- **Alternativa A (Descartada)**: Intentar forzar la permanencia de `MapCameraManager` envolviéndolo en contenedores `<View collapsable={false}>` o intentando forzar claves fijas (`key`). Descartado porque la vista nativa de MapLibre en Android sigue sufriendo reinicios y caídas de puente nativo debido a la inyección de nodos de vista no nativos en su jerarquía C++.
- **Alternativa B (Elegida)**: Trasladar el componente `<MapLibreGL.Camera />` y toda la orquestación de efectos de la cámara directamente a `MapContent.tsx`. Elegida porque respeta la convención de diseño de componentes nativos de React Native Mapbox/MapLibre y asegura estabilidad de ciclo de vida del 100% en Android.

### Decision 2: Estabilización de Referencias en un Componente Persistente

- **Por qué**: `MapContent` está montado en `index.tsx` bajo una condición estática (`{true ? <MapContent ... /> : <View ... />}`). Esto significa que **nunca se desmonta** durante la navegación o el uso habitual de la pantalla de mapa.
- **Enfoque**: Al mover `hasInitialized.current` a `MapContent`, nos aseguramos de que el booleano sobreviva a cualquier actualización del estado de Zustand, cambios de zoom o gestos táctiles. El encuadre inicial se ejecutará estrictamente una sola vez al arrancar la app.

## Risks / Trade-offs

- **[Riesgo] Aumento del tamaño del archivo `MapContent.tsx`** → **Mitigación**: La lógica de cámara será agrupada de forma muy limpia bajo secciones delimitadas (`// --- Camera Orchestration ---`) con comentarios explícitos para mantener la alta legibilidad del código.
- **[Riesgo] Pérdida de la interfaz imperativa (useImperativeHandle)** → **Mitigación**: Al estar la cámara y sus efectos en el mismo componente, ya no es necesario exponer métodos mediante un ref imperativo; las referencias del mapa (`mapRef`) y de la cámara (`cameraRef`) se resuelven de forma directa y local en el mismo ámbito.
