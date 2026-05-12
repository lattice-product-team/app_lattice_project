## Why

La estructura actual de la documentación del proyecto Lattice utiliza una nomenclatura alfabética (a-j) y descriptiva que responde a un contexto académico previo. En un entorno de ingeniería profesional, esta estructura dificulta la escalabilidad, la navegación intuitiva y el mantenimiento por parte de equipos multidisciplinares.

Moverse a una estructura basada en dominios lógicos (Architecture, API, Guides, Product, Engineering) alinea el proyecto con los estándares de la industria (estilo Stripe, Vercel o GitHub), proyectando una imagen mucho más premium y profesional.

## What Changes

1. **Reestructuración de Directorios**: Se eliminarán los prefijos alfabéticos y se agruparán los documentos en 5 pilares fundamentales:
   - `/docs/architecture`: Diseño del sistema y decisiones técnicas.
   - `/docs/api`: Especificación de contratos y servicios.
   - `/docs/guides`: Onboarding y manuales de uso.
   - `/docs/product`: Visión de negocio, roadmaps y experiencia de usuario.
   - `/docs/engineering`: Estándares de calidad, procesos de CI/CD y guías de desarrollo.
2. **Estandarización de Formato**: Todos los archivos se migrarán a formato `.mdx` para soportar componentes interactivos en la web de documentación.
3. **Limpieza de Rutas**: Se renombrarán los archivos `README.md` a `index.mdx` dentro de sus nuevas carpetas para generar URLs limpias y profesionales.

## Capabilities

### New Capabilities
- `docs-architecture-domain`: Agrupación de documentos técnicos de alto nivel (C4, Data Flow, ADRs).
- `docs-api-domain`: Centralización de la documentación de contratos y endpoints.
- `docs-guides-domain`: Estructuración de guías de inicio rápido y despliegue.
- `docs-product-domain`: Espacio para la visión estratégica y definición de producto.
- `docs-engineering-domain`: Documentación sobre estándares de código y procesos de calidad.

## Impact

- **Web de Documentación**: Se actualizará el sidebar para reflejar la nueva jerarquía.
- **Flujo de Trabajo**: Los desarrolladores guardarán la nueva documentación en carpetas semánticas en lugar de carpetas numeradas.
- **SEO/Navegabilidad**: Mejora en la estructura de URLs del sitio estático.
