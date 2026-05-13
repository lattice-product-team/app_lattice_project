## Context

Actualmente, el sistema de Lattice utiliza un campo único `imageUrl` para eventos y POIs. Esto resulta insuficiente para las nuevas necesidades de diseño premium que requieren múltiples activos visuales para diferentes contextos (listas, portadas de detalle, galerías).

## Goals / Non-Goals

**Goals:**
- Extender el esquema de base de datos para soportar múltiples URLs de imágenes.
- Implementar una cabecera de detalle inmersiva con soporte para banners de alta resolución.
- Crear un carrusel de galería funcional que consuma datos reales.
- Asegurar una migración fluida de los datos existentes.

**Non-Goals:**
- Implementar un sistema de subida de imágenes (se asume que las URLs ya existen).
- Modificar el sistema de caché de imágenes de la app móvil.

## Decisions

### 1. Uso de JSONB para galerías
Se ha decidido utilizar el tipo `jsonb` en PostgreSQL para el campo `gallery_urls`. 
- **Rationale**: Permite almacenar una lista flexible de URLs sin necesidad de una tabla relacional compleja para las fotos, facilitando la escalabilidad y las consultas rápidas desde el frontend.

### 2. Mapeo en el Adaptador (Frontend)
El `DetailModel` actuará como el contrato único para la interfaz de detalle.
- **Rationale**: Al centralizar el mapeo en `useDetailModel`, desacoplamos la estructura de la base de datos de los componentes de UI, permitiendo cambios futuros en el backend sin afectar la lógica de renderizado.

### 3. Efecto Parallax y Fade en el Banner
El banner se implementará en la cabecera usando `react-native-reanimated`.
- **Rationale**: Ofrece una experiencia de usuario superior y fluida que se alinea con los estándares "premium" solicitados, aprovechando el hardware para las animaciones.

## Risks / Trade-offs

- **[Risk] Carga de datos pesados** → **Mitigación**: Usar carga progresiva y optimización de imágenes (resize) en las URLs de Unsplash/CDN.
- **[Risk] Inconsistencia en datos antiguos** → **Mitigación**: Los adaptadores incluirán fallbacks por defecto para entidades que no tengan banner o galería definida.
