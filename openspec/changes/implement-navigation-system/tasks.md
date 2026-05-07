## 1. Infraestructura y Backend (Valhalla)

- [x] 1.1 Añadir el servicio `valhalla` al `docker-compose.yml`.
- [x] 1.2 Crear script de inicialización para descargar y procesar datos OSM de Barcelona.
- [x] 1.3 Configurar perfiles de 'auto' y 'pedestrian' en la configuración de Valhalla.
- [x] 1.4 Verificar que el endpoint de rutas es accesible desde la red local.

## 2. Configuración y Lógica Mobile

- [x] 2.1 Instalar dependencias: `expo-location` y `lucide-react-native` (para iconos).
- [x] 2.2 Crear `useNavigationStore` con Zustand para gestionar el estado de la ruta.
- [x] 2.3 Implementar `NavigationService.ts` para realizar peticiones al API de Valhalla.
- [x] 2.4 Desarrollar lógica de seguimiento de posición y actualización de instrucciones.

## 3. Componentes de Interfaz (UI)

- [x] 3.1 Crear el componente `InstructionBanner` con efecto glassmorphism oscuro y textos en inglés.
- [x] 3.2 Crear el componente `ArrivalSummary` para el panel inferior con datos de llegada.
- [x] 3.3 Implementar el componente `NavigationOverlay` que orqueste ambos banners.
- [x] 3.4 Diseñar e implementar el icono "Navigation Puck" en 2D con rotación dinámica.

## 4. Integración con el Mapa

- [x] 4.1 Añadir la capa `NavigationLayer` (LineLayer) al componente principal de mapa.
- [x] 4.2 Implementar la lógica de cámara para seguimiento automático (Course mode) y pitch de 45º.
- [x] 4.3 Integrar el botón "Start Navigation" en la hoja de detalles de eventos existente.

## 5. Pruebas y Pulido

- [ ] 5.1 Verificar el cálculo de rutas entre dos puntos conocidos de Barcelona.
- [ ] 5.2 Validar que las instrucciones del banner superior coinciden con la ruta visual.
- [ ] 5.3 Testear el comportamiento de la cámara con simulación de movimiento.
