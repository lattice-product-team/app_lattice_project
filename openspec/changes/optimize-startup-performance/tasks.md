## 1. Limpieza y Preparación

- [x] 1.1 Eliminar las llamadas a `prewarmMapStyle` en `RootLayout`
- [x] 1.2 Eliminar el archivo `useMapStyle.ts` y sus referencias
- [x] 1.3 Limpiar `mapConstants.ts` de URLs de estilos remotos innecesarias

## 2. Infraestructura de Carga

- [x] 2.1 Implementar carga anticipada de assets locales (JSON de estilos) con `Asset.loadAsync`
- [x] 2.2 Crear utilidad `StartupMetrics` para medir y loguear el tiempo hasta la interactividad (TTI)

## 3. Pre-fetching de Datos

- [x] 3.1 Integrar `queryClient.prefetchQuery` en `RootLayout` para los POIs globales
- [x] 3.2 Integrar `queryClient.prefetchQuery` en `Index.tsx` para los Eventos
- [x] 3.3 Asegurar que los hooks del mapa consuman la caché de forma inmediata

## 4. Verificación y Pulido

- [ ] 4.1 Verificar en los logs que el tiempo de arranque ha disminuido significativamente
- [ ] 4.2 Validar que el mapa se renderiza con iconos al instante sin "flash" de carga
