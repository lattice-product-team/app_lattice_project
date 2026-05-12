# App Lattice Documentation

Este es el sitio de documentación oficial de **App Lattice**, construido con **Nextra 4** y **Next.js**.

## Cómo empezar

Para ejecutar el sitio de documentación localmente:

```bash
pnpm dev:docs
```

El sitio estará disponible en [http://localhost:3001](http://localhost:3001).

## Estructura de Contenido

Toda la documentación se encuentra en la carpeta `src/pages`. Utilizamos archivos `.md` y `.mdx` para el contenido.

La organización del menú lateral se gestiona a través de los archivos `_meta.json` en cada directorio.

## Personalización

El diseño y la configuración del tema se encuentran en:
- `theme.config.tsx`: Configuración de Nextra (Logo, footer, links).
- `src/styles/globals.css`: Estilos globales y Tailwind CSS 4.
