## Context

La arquitectura actual de Lattice procesa geometrías en cada petición HTTP, lo que impacta negativamente en el tiempo de respuesta del primer renderizado del mapa (TTI). Al tener ya una instancia de Redis corriendo para Socket.io, podemos reutilizarla para implementar una capa de almacenamiento temporal de objetos GeoJSON.

## Goals / Non-Goals

**Goals:**

- Reducir el tiempo de respuesta de `getPois` y `getEventSpatial` en un 80% para peticiones cacheadas.
- Unificar la gestión de Redis en un único servicio singleton.
- Mantener la integridad de los datos mediante una invalidación de caché estricta.

**Non-Goals:**

- Cachear resultados de rutas de navegación (fuera de alcance en esta fase).
- Implementar persistencia de Redis (seguiremos usando RAM).

## Decisions

### 1. Redis Shared Service

**Decisión**: Crear `apps/server/api/redis.ts` como un singleton que exporta un cliente conectado.
**Razón**: Evita múltiples conexiones redundantes y facilita la inyección del cliente en controladores y otros servicios (como Socket.io).

### 2. Formato de Almacenamiento

**Decisión**: Guardar los resultados como `string` (JSON serializado) directamente en Redis usando `SET` y `GET`.
**Razón**: `ST_AsGeoJSON` de PostGIS ya nos entrega un string. Guardarlo así evita el overhead de convertir de objeto a string en cada lectura.

### 3. TTL (Time To Live)

**Decisión**: Usar un TTL por defecto de 1 hora (`3600s`) para todas las geometrías.
**Razón**: Aunque la invalidación es reactiva, un TTL asegura que los datos no se queden "huérfanos" si un evento de invalidación falla por alguna razón.

### 4. Fallback y Resiliencia

**Decisión**: Si Redis falla, el sistema DEBE capturar el error, loguearlo y consultar directamente a PostGIS.
**Razón**: La disponibilidad del mapa es prioritaria sobre el rendimiento.

### 5. Métricas (Observabilidad)

**Decisión**: Añadir la cabecera HTTP `X-Cache` (valores: `HIT` o `MISS`) en las respuestas de la API.
**Razón**: Permite verificar el funcionamiento de la caché desde las herramientas de desarrollo sin necesidad de acceder a los logs del servidor.

## Risks / Trade-offs

- **[Riesgo] Estale Data** → Si un controlador modifica la DB pero olvida invalidar la caché, el usuario verá datos viejos. **Mitigación**: Centralizar las operaciones de invalidación en un helper `clearGeoCache()`.
- **[Riesgo] Memoria de Redis** → Un gran volumen de geometrías podría llenar la RAM. **Mitigación**: Monitorear el tamaño de los GeoJSON; las geometrías de eventos suelen ser ligeras (<100KB).
