## 1. Database & Schema

- [x] 1.1 Actualizar `packages/db/src/schema.ts` para incluir `bannerUrl` y `galleryUrls` (jsonb).
- [x] 1.2 Generar y aplicar la migración de base de datos (`db:generate` & `db:migrate`).
- [x] 1.3 Actualizar el script de seed (`seed-master.ts`) con imágenes reales de alta resolución.

## 2. Adaptadores & Hooks

- [x] 2.1 Actualizar el tipo `DetailModel` en `apps/mobile/src/types/models/detail.ts`.
- [x] 2.2 Modificar el hook `useDetailModel.ts` para mapear los nuevos campos multimedia.
- [x] 2.3 Asegurar que `imageUrl` se utilice como el activo de perfil/thumbnail por defecto.

## 3. UI Components (Mobile)

- [x] 3.1 Actualizar `SheetHeader.tsx` para soportar `bannerUrl` con efectos de animación.
- [x] 3.2 Implementar lógica de parallax y fade en el banner basada en el scroll de la hoja.
- [x] 3.3 Modificar `EventDetailSheet.tsx` para inyectar la galería dinámica desde el modelo.
- [x] 3.4 Verificar el contraste de los textos de la cabecera sobre diferentes tipos de banners.

## 4. Estabilización de Capas de Mapa

- [x] 4.1 Implementar la capa de perímetros (boundaries) en `MapLayers.tsx` para evitar el "efecto desaparición".
- [x] 4.2 Asegurar que los perímetros usen el color primario del evento definido en la base de datos.
