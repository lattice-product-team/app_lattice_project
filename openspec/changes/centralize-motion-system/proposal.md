## Why

El sistema de animaciones actual está fragmentado, con constantes de física de muelle (`damping`, `stiffness`) duplicadas y hardcodeadas en múltiples componentes. Esto dificulta el mantenimiento, impide ajustes globales de la "sensación" de la app y reduce la profesionalidad del código. Centralizar estos valores en "Motion Tokens" permitirá una interfaz coherente y escalable.

## What Changes

- **Extensión del Tema**: Adición de una propiedad `motion` a `LatticeTheme` que contenga preajustes de física (`magnetic`, `responsive`, `snappy`, `gentle`).
- **Refactorización Global**: Sustitución de todos los objetos de configuración de `withSpring` hardcodeados por referencias a los nuevos tokens del tema.
- **Limpieza de Código**: Eliminación de constantes `SPRING_CONFIG` locales en componentes de mapa y UI.

## Capabilities

### New Capabilities

- `unified-motion-system`: Define la arquitectura de tokens de movimiento para la aplicación, asegurando que todas las animaciones sigan presets predefinidos.

### Modified Capabilities

- `design-tokens`: Se expande la definición de tokens para incluir propiedades de animación y física.

## Impact

- `apps/mobile/src/styles/theme.ts`: Modificación de la interfaz `LatticeTheme` y los objetos `lightTheme`/`darkTheme`.
- `apps/mobile/app/(main)/index.tsx`, `EventDetailSheet.tsx`, `POIMiniCard.tsx`: Uso de los nuevos tokens.
- Múltiples componentes de UI (`AuthPromptSheet`, `PremiumButton`, etc.): Refactorización para usar el tema.
