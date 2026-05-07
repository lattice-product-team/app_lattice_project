## Context

Lattice requiere una experiencia de navegación integrada que mantenga la estética premium de la aplicación. Actualmente, la app utiliza `@maplibre/maplibre-react-native` para la visualización de mapas, pero carece de lógica de rutas y guía activa.

## Goals / Non-Goals

**Goals:**

- Implementar un motor de rutas propio (Valhalla) para evitar costes de APIs externas.
- Crear una interfaz de navegación inmersiva con "Active Navigation Mode".
- Soportar perfiles de "Coche" y "Caminando" con cálculo de tiempo y distancia real.
- Implementar guía paso a paso (Turn-by-turn) visualmente alineada con el diseño de Lattice (glassmorphism).

**Non-Goals:**

- Soporte para transporte público en esta fase.
- Navegación offline (requeriría descarga masiva de datos en el dispositivo).
- Guía por voz (TTS) - se deja para una iteración futura.

## Decisions

### 1. Motor de Rutas (Backend)

- **Tecnología:** Valhalla (vía Docker).
- **Razón:** Valhalla es extremadamente eficiente, modular y soporta perfiles de "walking" muy detallados (escaleras, caminos peatonales).
- **Infraestructura:** Adición de un servicio `valhalla` en `docker-compose.yml` usando la imagen oficial.

### 2. Lógica de Navegación (Mobile)

- **Framework:** `Ferrostar`.
- **Razón:** Proporciona un SDK de navegación real compatible con MapLibre, gestionando el estado de la ruta, el recálculo automático y la generación de instrucciones de maniobra.
- **Ubicación:** `apps/mobile/src/services/navigation/`.

### 3. Interfaz de Usuario (UI)

- **Estética:** Glassmorphism oscuro para instrucciones superiores y claro para el resumen inferior.
- **Componentes:**
  - `NavigationOverlay.tsx`: Contenedor principal del modo navegación.
  - `InstructionBanner.tsx`: Banner superior con el siguiente giro.
  - `ArrivalSummary.tsx`: Panel inferior con llegada/tiempo/distancia.
- **MapLibre integration:** Uso de `followUserMode="course"` y `pitch={45}` para la cámara de navegación.

### 4. Gestión de Estado

- **Store:** Zustand (`useNavigationStore`).
- **Responsabilidad:** Almacenar la ruta activa, el paso actual de la navegación y el modo de transporte seleccionado.

## Risks / Trade-offs

- **Precisión de GPS:** En interiores o zonas de alta densidad, el salto de posición puede afectar al recálculo de rutas. Se implementará un umbral de desviación.
- **Consumo de Batería:** La navegación activa requiere GPS de alta precisión constante. Se debe informar al usuario o activar solo bajo demanda.
- **Datos OSM:** La calidad de las rutas depende de la actualización de OpenStreetMap en la zona.
