## Context

El renderizado de mapas con MapLibreGL es un proceso asíncrono que depende de la descarga de un JSON de estilo y de múltiples tiles vectoriales. Actualmente, el componente `MapContent` se renderiza inmediatamente, lo que provoca que el usuario vea un lienzo vacío o incompleto durante los primeros ~1.5 segundos. 

## Goals / Non-Goals

**Goals:**
- Eliminar el parpadeo visual en la carga inicial.
- Proveer una transición estética de alta fidelidad entre la pantalla de carga y el mapa interactivo.
- Reducir el tiempo de espera percibido mediante la pre-carga de recursos de estilo.

**Non-Goals:**
- Implementar soporte offline completo.
- Modificar el motor de renderizado interno de MapLibre.

## Decisions

### 1. Arquitectura del Overlay (`MapLoadingOverlay`)
Se creará un componente dedicado `MapLoadingOverlay.tsx` dentro de `features/map/components/`. 
- **Rationale**: Separar la lógica visual del loading de la lógica compleja de capas de `MapContent`.
- **Implementation**: Posicionamiento absoluto (`StyleSheet.absoluteFill`) con un `zIndex` superior.

### 2. Sincronización de Estados
Utilizaremos un estado local `isMapReady` en `MapContent.tsx`.
- **Rationale**: El estado de "listo" es intrínseco al ciclo de vida del componente del mapa. 
- **Trigger**: Se activará mediante el prop `onDidFinishLoadingMap` del componente `MapView`.

### 3. Estrategia de Pre-carga (Style Pre-warming)
Expondremos una función `prewarmMapStyles` desde el hook `useMapStyle`.
- **Rationale**: Permite iniciar la descarga del estilo de MapTiler en el `RootLayout.tsx` o en la redirección de entrada sin esperar a que el componente del mapa se monte.
- **Alternatives**: Cargar los estilos localmente (descartado por la necesidad de usar claves de API dinámicas y actualizaciones de MapTiler).

### 4. Animaciones de Transición
Usaremos `react-native-reanimated` para el desvanecimiento.
- **Configuración**: `withTiming(0, { duration: 600 })` para la opacidad.
- **Efecto extra**: Un ligero escalado (`scale: 1.05` a `1.0`) para dar profundidad a la revelación.

### 5. Sincronización de Cámara Inicial
Para evitar el "salto azul" desde el punto [0,0], el mapa se inicializará usando las coordenadas del `useLocationStore` en las `defaultSettings` de la cámara.
- **Rationale**: MapLibre empezará a descargar los tiles de la zona real del usuario desde el primer frame, oculto tras el overlay.
- **Evento**: Se utilizará `onMapIdle` (solo para la primera carga) en lugar de `onDidFinishLoadingMap` para asegurar que el renderizado de tiles ha finalizado.

## Risks / Trade-offs

- **[Riesgo] Fallo de Red**: Si los estilos no cargan, el loading podría quedarse infinito.
  - **Mitigación**: Implementar un timeout de seguridad (5 segundos) que revele el mapa incluso si no hay confirmación de estilo cargado.
- **[Trade-off] Consumo de Memoria**: La pre-carga consume memoria adicional al inicio.
  - **Mitigación**: Los estilos JSON son pequeños (~50KB) y la caché es eficiente.
