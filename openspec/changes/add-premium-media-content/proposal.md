## Why

Actualmente, los eventos y lugares (POIs) solo cuentan con una imagen básica (`imageUrl`), lo que limita la riqueza visual de la aplicación. Para ofrecer una experiencia verdaderamente "premium" y envolvente, es necesario permitir que cada entidad muestre su identidad a través de banners de alta resolución, logos/thumbnails específicos y una galería de imágenes que permita al usuario explorar el lugar antes de visitarlo.

## What Changes

- **Esquema de Base de Datos**: Actualización de las tablas `events` y `points_of_interest` para incluir `banner_url` y `gallery_urls`.
- **Adaptadores de Datos**: Modificación de `poiAdapter.ts` y `useDetailModel.ts` para mapear los nuevos campos multimedia.
- **Interfaz de Detalle (Mobile)**:
  - Rediseño de la cabecera para soportar imágenes de banner con efecto parallax.
  - Implementación de un carrusel dinámico en la sección de galería utilizando los datos reales de la base de datos.
- **Deduplicación de Campos**: Consolidación de `imageUrl` como la foto de perfil/thumbnail principal.

## Capabilities

### New Capabilities

- `premium-media-gallery`: Sistema de visualización de galerías de fotos de alta resolución con soporte para carruseles interactivos.

### Modified Capabilities

- `event-branding-model`: Ampliación del modelo de marca para incluir activos visuales secundarios (banners y activos de galería).
- `poi-metadata-registry`: Inclusión de campos multimedia estándar en el registro de metadatos de puntos de interés.
- `event-detail-sheet`: Actualización de los requisitos de renderizado para soportar hero images (banners) y contenido dinámico de galería.

## Impact

- **Database**: `events` and `points_of_interest` tables (migration required).
- **Backend API**: Data models and seed scripts.
- **Mobile UI**: `EventDetailSheet`, `SheetHeader`, `GalleryCarousel` and related detail hooks.
