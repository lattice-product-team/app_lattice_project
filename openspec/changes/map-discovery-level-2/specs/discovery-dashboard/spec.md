## ADDED Requirements

### Requirement: Contextual Filter Chips

El sistema DEBE mostrar una fila horizontal de filtros temporales justo debajo de la barra de búsqueda cuando la isla se expande al menos al nivel medio.

#### Scenario: Filters visibility

- **WHEN** la isla alcanza la altura del 45% (Nivel 2).
- **THEN** DEBEN aparecer los chips de "Hoy", "Mañana" y "Este finde" con un efecto de fade-in.

### Requirement: Quick Categories Carousel

El dashboard DEBE incluir un carrusel de categorías de Puntos de Interés (POI) para facilitar el descubrimiento rápido.

#### Scenario: Category interaction

- **WHEN** el usuario pulsa una categoría (ej. "Café").
- **THEN** el mapa DEBE filtrar los POIs para mostrar solo esa categoría y la isla DEBE permanecer en su estado actual.
