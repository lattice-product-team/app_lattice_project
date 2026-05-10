## Why
Actualmente, las consultas espaciales (POIs y límites de eventos) requieren que PostGIS procese geometrías complejas (ST_AsGeoJSON) en cada petición. Esto genera una latencia innecesaria (~100-300ms) y carga la CPU de la base de datos, especialmente bajo tráfico intenso de usuarios móviles.

## What Changes
- Implementación de una capa de caché en Redis para resultados GeoJSON de POIs y Eventos.
- Lógica de invalidación de caché reactiva (basada en eventos de escritura).
- Creación de un servicio singleton de Redis compartido para todo el backend.

## Capabilities

### New Capabilities
- `geometry-caching`: Sistema de almacenamiento y recuperación de objetos GeoJSON serializados en Redis.

### Modified Capabilities
- `realtime-admin-sync`: Se añade el requisito de invalidar la caché antes de emitir notificaciones de actualización.

## Impact
- `apps/server/geo`: Modificación de controladores para incluir la lógica de lectura/escritura de caché.
- `apps/server/api`: Creación de un nuevo servicio `redis.ts`.
- Base de Datos: Reducción significativa de ejecuciones de funciones espaciales costosas.
