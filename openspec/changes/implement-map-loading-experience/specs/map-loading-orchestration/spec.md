## ADDED Requirements

### Requirement: Background Style Pre-fetching

El sistema SHALL iniciar la descarga y el procesamiento de los estilos de MapTiler (Light y Dark) durante la fase de inicialización de la aplicación (Root Layout), antes de que el usuario navegue a la pantalla del mapa.

#### Scenario: Pre-fetch on app startup

- **WHEN** la aplicación se monta en el `RootLayout`
- **THEN** se disparan las peticiones de fetch para los estilos configurados en `mapConstants` y se almacenan en la caché global de estilos.

### Requirement: Persistent Loading Overlay

El sistema SHALL mostrar un overlay visual de alta fidelidad que cubra toda la superficie del mapa mientras este no haya completado su renderizado inicial.

#### Scenario: Overlay visible on map mount

- **WHEN** el componente `MapContent` se monta por primera vez
- **THEN** el overlay se muestra con opacidad 1, bloqueando la visión de la carga de tiles por debajo.

### Requirement: Readiness Synchronization

El sistema SHALL ocultar el overlay de carga únicamente después de recibir la señal de que el mapa base ha sido totalmente cargado y el estilo ha sido aplicado correctamente.

#### Scenario: Smooth reveal after map ready

- **WHEN** MapLibre emite el evento `onDidFinishLoadingMap`
- **THEN** el overlay inicia una animación de fade-out de 600ms y posteriormente se desmonta para permitir la interacción con el mapa.

### Requirement: Theme-Aware Aesthetics

El overlay de carga SHALL adaptar su paleta de colores y efectos de desenfoque al tema activo (Light/Dark) de la aplicación de forma automática.

#### Scenario: Theme matching

- **WHEN** la aplicación está en modo oscuro
- **THEN** el overlay utiliza el color `Midnight Blue` profundo y un tinte de blur oscuro coherente con la estética de Lattice.
