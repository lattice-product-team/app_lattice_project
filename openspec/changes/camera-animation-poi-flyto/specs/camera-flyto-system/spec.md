## ADDED Requirements

### Requirement: Cámara Cinemática FlyTo
El sistema SHALL permitir la transición suave de la cámara entre dos puntos geográficos utilizando una curva de animación parabólica (FlyTo).

#### Scenario: Vuelo a coordenadas seleccionadas
- **WHEN** se invoca el método `flyTo` con un destino `[lon, lat]`
- **THEN** la cámara DEBE desplazarse suavemente durante un periodo de tiempo definido (por defecto 2000ms)
- **THEN** el nivel de zoom DEBE ajustarse para proporcionar contexto espacial durante el vuelo (arco de elevación).

### Requirement: Detección de Origen de Selección
El sistema SHALL distinguir entre selecciones de POI/Eventos realizadas desde la interfaz de usuario (carruseles, listas) y selecciones realizadas mediante toques directos en el mapa.

#### Scenario: Animación condicional por origen
- **WHEN** un POI es seleccionado desde un `POICarousel` o `DiscoveryDashboard`
- **THEN** se DEBE activar una animación `flyTo`.
- **WHEN** un POI es seleccionado mediante un toque directo en su marcador del mapa
- **THEN** se DEBE mantener el comportamiento de `snap` (cambio instantáneo) o no realizar movimiento de cámara.
