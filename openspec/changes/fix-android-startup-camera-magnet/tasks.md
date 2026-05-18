## 1. Migración y Aplanamiento de la Cámara

- [x] 1.1 Declarar refs, efectos de ciclo de vida de cámara y manejadores de cámara directamente dentro de `MapContent.tsx`
- [x] 1.2 Integrar el componente `<MapLibreGL.Camera />` como hijo directo de `<MapLibreGL.MapView />` en `MapContent.tsx`
- [x] 1.3 Eliminar el componente `<MapCameraManager />` de `MapContent.tsx` y su importación en el encabezado del archivo
- [x] 1.4 Borrar por completo el archivo `MapCameraManager.tsx` del sistema de archivos

## 2. Estabilización de Referencias y Enfoque de Arranque

- [x] 2.1 Declarar `hasInitialized = useRef(false)` en el nivel superior de `MapContent.tsx` para garantizar su permanencia persistente sin desmonajes
- [x] 2.2 Re-conectar el efecto de encuadre inicial (Startup Snap) en `MapContent.tsx` utilizando la referencia persistente de inicialización
- [ ] 2.3 Validar que el encuadre inicial ocurra una única vez en dispositivos Android y no teletransporte la cámara durante los arrastres manuales

## 3. Pruebas y Verificación

- [ ] 3.1 Verificar el paneo manual del mapa en Android durante el arranque y comprobar que el control de cámara FREE esté 100% activo
- [ ] 3.2 Probar los gestos táctiles (zoom y scroll) para asegurar que no se produzcan regresiones o intercepciones conflictivas en Android
- [ ] 3.3 Confirmar que la compilación de producción en Android funcione sin advertencias ni fallos en el puente nativo
