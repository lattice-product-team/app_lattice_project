## 1. Refactorización del Script de Sincronización

- [x] 1.1 Actualizar `apps/docs/sync-docs.sh` con la lógica de mapeo de dominios (Architecture, API, Guides, Product, Engineering).
- [x] 1.2 Implementar en el script el renombrado automático de `README.md` a `index.mdx`.
- [x] 1.3 Asegurar que todos los archivos `.md` se copien con extensión `.mdx`.
- [x] 1.4 Añadir filtros para excluir archivos de código nativo (`.html`, `.py`, `.ts`, etc.) de `src/pages`.

## 2. Preparación del Entorno

- [x] 2.1 Borrar la caché de Next.js (`apps/docs/.next`) para evitar conflictos de rutas antiguas.
- [x] 2.2 Limpiar el directorio `src/pages` actual para recibir la nueva estructura limpia.

## 3. Ejecución y Verificación

- [x] 3.1 Ejecutar `pnpm dev:docs` para disparar el nuevo script de sincronización.
- [x] 3.2 Verificar que el sidebar de Nextra muestra los nuevos dominios profesionales.
- [x] 3.3 Comprobar que las URLs como `/architecture/` cargan correctamente el contenido.

## 4. Limpieza Final

- [x] 4.1 Verificar que no queden archivos con extensión `.md` en el directorio de salida.
- [x] 4.2 Confirmar que los assets (imágenes) se visualizan correctamente tras la desactivación de `staticImage`.
