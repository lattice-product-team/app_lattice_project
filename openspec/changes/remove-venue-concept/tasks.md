## 1. Base de Datos y Esquema

- [ ] 1.1 Añadir columnas `is_permanent` (boolean) y `primary_color` (text) a la tabla `events` en `packages/db/src/schema.ts`
- [ ] 1.2 Generar y ejecutar la migración de Drizzle para las nuevas columnas
- [ ] 1.3 Crear script de migración de datos para mover perímetros y colores de `venues` a `events`
- [ ] 1.4 Re-vincular `points_of_interest`, `path_segments` y `tickets` directamente a `event_id`
- [ ] 1.5 Eliminar la tabla `venues` del esquema y de la base de datos
- [ ] 1.6 Actualizar `seed-master.ts` para eliminar Venues y usar solo Eventos (permanentes y temporales)

## 2. Servicios Backend (Geo & Auth)

- [ ] 2.1 Actualizar el servicio de `Auth` para obtener el color de branding directamente de la tabla `events`
- [ ] 2.2 Eliminar todas las rutas de `/venues` en `apps/server/geo/routes/geo.routes.ts`
- [ ] 2.3 Refactorizar `getEventSpatial` para que devuelva el GeoJSON completo (perímetro + POIs) en una sola llamada
- [ ] 2.4 Limpiar el `Gateway` para dejar de proxificar las rutas de `/venues`

## 3. Panel de Administración (Admin Web)

- [ ] 3.1 Eliminar la página de gestión de Venues y sus componentes relacionados
- [ ] 3.2 Refactorizar el Editor de Mapas para que el contexto raíz sea el Evento seleccionado
- [ ] 3.3 Actualizar los formularios de creación/edición de Eventos con los nuevos campos (`isPermanent`, `primaryColor`)
- [ ] 3.4 Eliminar el selector de Venues en el hook `use-admin-data.ts`

## 4. Aplicación Móvil

- [ ] 4.1 Actualizar `geoService.ts` para eliminar `getVenueSpatial` y cualquier referencia a Venues
- [ ] 4.2 Refactorizar la lógica del mapa principal para consumir únicamente datos espaciales de Eventos
- [ ] 4.3 Eliminar todas las referencias a `venueId` y `venue_id` en el estado global y componentes
- [ ] 4.4 Actualizar las cadenas de texto en `Info.plist` (permisos de GPS) para hablar de "eventos" en lugar de "recintos"
