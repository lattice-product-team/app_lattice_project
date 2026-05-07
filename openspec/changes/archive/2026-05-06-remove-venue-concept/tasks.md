## 1. Base de Datos y Esquema

- [x] 1.1 Añadir columnas `is_permanent` (boolean) y `primary_color` (text) a la tabla `events` en `packages/db/src/schema.ts`
- [x] 1.2 Generar y ejecutar la migración de Drizzle para las nuevas columnas
- [x] 1.3 Actualizar `seed-master.ts` para eliminar Venues y usar solo Eventos (permanentes y temporales)
- [x] 1.4 Crear script de migración de datos para mover perímetros y colores de `venues` a `events`
- [x] 1.5 Eliminar la tabla `venues` del esquema y de la base de datos
- [x] 1.6 Re-vincular `points_of_interest`, `path_segments` y `tickets` directamente a `event_id`

## 2. Servicios Backend (Geo & Auth)

- [x] 2.1 Actualizar el servicio de `Auth` para obtener el color de branding directamente de la tabla `events`
- [x] 2.2 Eliminar todas las rutas de `/venues` en `apps/server/geo/routes/geo.routes.ts`
- [x] 2.3 Refactorizar `getEventSpatial` para que devuelva el GeoJSON completo (perímetro + POIs) en una sola llamada
- [x] 2.4 Limpiar el `Gateway` para dejar de proxificar las rutas de `/venues`

## 3. Panel de Administración (Admin Web)

- [x] 3.1 Eliminar la página de gestión de Venues y sus componentes relacionados
- [x] 3.2 Refactorizar el Editor de Mapas para que el contexto raíz sea el Evento seleccionado
- [x] 3.3 Actualizar los formularios de creación/edición de Eventos con los nuevos campos (`isPermanent`, `primaryColor`)
- [x] 3.4 Eliminar el selector de Venues en el hook `use-admin-data.ts`

## 4. Aplicación Móvil

- [x] 4.1 Actualizar `geoService.ts` para eliminar `getVenueSpatial` y cualquier referencia a Venues
- [x] 4.2 Refactorizar la lógica del mapa principal para consumir únicamente datos espaciales de Eventos
- [x] 4.3 Eliminar todas las referencias a `venueId` y `venue_id` en el estado global y componentes
- [x] 4.4 Actualizar las cadenas de texto en `app.config.ts` (permisos de GPS) para hablar de "eventos" en lugar de "recintos"
