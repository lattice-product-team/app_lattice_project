## Context

La aplicación presenta problemas de fluidez en Android, específicamente en dispositivos con recursos limitados. El análisis preliminar indica que el hilo de JS se bloquea frecuentemente debido a re-renders innecesarios en la página principal (`MapIndexPage`) y transiciones complejas en los bottom sheets que no están totalmente desacopladas del estado de React.

## Goals / Non-Goals

**Goals:**
- Reducir el tiempo de respuesta al interactuar con botones y pestañas (Explore/Map) en Android.
- Eliminar el "jitter" en las transiciones de `EventDetailSheet`.
- Implementar un sistema de monitoreo básico para validar las mejoras.
- Asegurar que la aplicación mantenga 60fps en la mayoría de las interacciones comunes.

**Non-Goals:**
- No se reescribirá la lógica de navegación central (Expo Router).
- No se optimizará el backend ni la latencia de red en este cambio.
- No se cambiará el motor de mapas (`MapLibre`).

## Decisions

### 1. Memoización Selectiva de Componentes de UI
- **Decisión**: Aplicar `React.memo` a los items del `DiscoveryFeed` y a los controles del mapa.
- **Razón**: El `MapIndexPage` gestiona muchos estados (capas de UI, búsqueda, navegación). Cada cambio de estado provoca un re-render de todo el árbol si no está memoizado, lo cual es costoso en Android.
- **Alternativas**: Usar una arquitectura de "slots" o mover el estado a un nivel más bajo, pero la memoización es menos invasiva y efectiva aquí.

### 2. Desacoplamiento de Animaciones mediante `useAnimatedStyle`
- **Decisión**: Mover todos los cálculos de estilo dinámico (opacidad, transformaciones) a `useAnimatedStyle`.
- **Razón**: Esto asegura que las actualizaciones se realicen directamente en el hilo de la UI (C++) sin pasar por el puente de JS en cada frame.
- **Alternativas**: Usar el `Animated` API estándar, pero Reanimated 3+ es superior para gestos complejos.

### 3. Carga Diferida (Lazy Loading) del Mapa
- **Decisión**: Solo inicializar `MapLibreGL.MapView` cuando el usuario cambie a la pestaña "Map".
- **Razón**: El mapa consume mucha memoria y CPU. Al cargar la app en modo "Explore", no es necesario tener el mapa activo en segundo plano.
- **Alternativas**: Mantener el mapa siempre activo para cambios instantáneos, pero el costo en dispositivos antiguos es demasiado alto.

### 4. Herramientas de Perfilado en Desarrollo
- **Decisión**: Implementar un componente `PerformanceMonitor` que use `react-native-performance` o `InteractionManager`.
- **Razón**: Necesitamos métricas objetivas para saber si las optimizaciones están funcionando.

## Risks / Trade-offs

- **[Riesgo] Stale Props en Memo** → **Mitigación**: Revisar cuidadosamente las dependencias en `React.memo` y `useCallback`.
- **[Riesgo] Complejidad en Reanimated** → **Mitigación**: Mantener las lógicas de interpolación simples y centralizadas en hooks.
- **[Riesgo] Overhead del perfilado** → **Mitigación**: Asegurarse de que el código de monitoreo esté totalmente excluido de los builds de producción (`__DEV__`).
