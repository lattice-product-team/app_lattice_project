## Context

Actualmente, el proyecto Lattice tiene una estructura de documentación heredada de un entorno académico, utilizando prefijos alfabéticos (`a-`, `b-`, etc.). Esta estructura se sincroniza mediante un script (`sync-docs.sh`) que copia los archivos directamente de `/docs` a `src/pages`.

Para profesionalizar el sitio, necesitamos desacoplar la estructura física de la estructura lógica y migrar a un esquema basado en dominios de ingeniería.

## Goals / Non-Goals

**Goals:**

- Implementar una estructura de 5 dominios profesionales: Architecture, API, Guides, Product, Engineering.
- Automatizar la migración mediante el script de sincronización.
- Estandarizar todas las extensiones a `.mdx`.
- Garantizar que las URLs sean limpias (usando `index.mdx` para los README).

**Non-Goals:**

- No se reescribirá el contenido de los documentos en esta fase, solo se reorganizarán.
- No se añadirán nuevos componentes interactivos MDX (esto se deja para fases posteriores).

## Decisions

### 1. Script de Sincronización Inteligente

En lugar de un `cp -r` simple, el script `sync-docs.sh` implementará una lógica de mapeo.

- **Rationale**: Permite mantener la estructura original si se desea por retrocompatibilidad, pero presentar una cara profesional en la web.
- **Alternativa**: Mover los archivos físicamente en el repo. Se descarta para no romper posibles links externos en el corto plazo hasta que la nueva estructura esté validada.

### 2. Conversión Automática a MDX

Todos los archivos `.md` se renombrarán a `.mdx` durante la copia a `src/pages`.

- **Rationale**: Nextra 2/3 maneja mejor el App/Pages router con `.mdx` y nos permite inyectar componentes en el futuro sin renombrar archivos de nuevo.

### 3. Normalización de README a Index

Cualquier archivo llamado `README.md` se convertirá en `index.mdx` en su destino.

- **Rationale**: Mejora el SEO y la estética de las URLs (ej: `/api/` en lugar de `/api/README`).

## Risks / Trade-offs

- **[Riesgo]** Links rotos entre documentos internos si usaban rutas relativas fijas.
  - **Mitigación**: Los editores deberán revisar los links tras la migración. El script imprimirá un reporte de los archivos movidos.
- **[Riesgo]** Cache de Next.js persistiendo rutas antiguas.
  - **Mitigación**: El comando `dev:docs` borrará `.next/cache` antes de arrancar la primera vez tras el cambio.
