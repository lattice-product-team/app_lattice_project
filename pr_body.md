### Resumen de cambios

Se ha evolucionado el panel de administración de eventos para convertirlo en una herramienta de monitorización profesional y de alta densidad.

**Backend & Datos:**
- **Resolución de Direcciones**: Implementada utilidad de geocodificación inversa (Nominatim) para obtener direcciones reales a partir de coordenadas.
- **Esquema de BD**: Añadida la columna `address` y soporte para metadatos operativos (categoría, capacidad).
- **Seeding Realista**: Actualizada la base de datos con eventos reales en Barcelona incluyendo ocupación y aforo.

**Frontend (Admin Dashboard):**
- **Tabla de Alta Densidad**: Rediseño completo de la tabla de eventos con scroll horizontal y soporte para múltiples columnas operativas.
- **Visualización de Ocupación**: Implementadas barras de progreso en tiempo real que reflejan la ocupación actual del evento con la estética "Achromatic Discipline" de la app.
- **Simplificación UX**: Optimización de la columna de detalles para priorizar el título y la legibilidad.
