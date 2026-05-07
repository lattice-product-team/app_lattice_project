## 1. Infraestructura del Tema

- [x] 1.1 Modificar la interfaz `LatticeTheme` en `apps/mobile/src/styles/theme.ts` para incluir la propiedad `motion`.
- [x] 1.2 Añadir los objetos de configuración de física (`magnetic`, `responsive`, `snappy`, `gentle`) a `baseTheme`.
- [x] 1.3 Exportar los nuevos tokens para asegurar que estén disponibles en `lightTheme` y `darkTheme`.

## 2. Refactorización de Componentes Críticos (Mapa)

- [x] 2.1 Refactorizar `apps/mobile/app/(main)/index.tsx` para usar `theme.motion.physics.magnetic`.
- [x] 2.2 Refactorizar `apps/mobile/src/features/map/components/EventDetailSheet.tsx` para usar `theme.motion.physics.magnetic`.
- [x] 2.3 Refactorizar `apps/mobile/src/features/map/components/POIMiniCard.tsx` para usar `theme.motion.physics.magnetic`.
- [x] 2.4 Refactorizar `apps/mobile/src/features/map/components/MapContent.tsx` para usar los tokens del tema.

## 3. Refactorización de Componentes de UI y Cleanup

- [x] 3.1 Actualizar componentes de botones (`PremiumButton`) para usar `theme.motion.physics.responsive`.
- [x] 3.2 Actualizar modales y hojas de ayuda (`AuthPromptSheet`, `PasskeyOnboardingSheet`) para usar `theme.motion.physics.snappy`.
- [x] 3.3 Revisar otros componentes identificados en la investigación (`EventPin`, `POIPin`, `WalletStack`) y aplicar los tokens correspondientes.
- [x] 3.4 Eliminar constantes `SPRING_CONFIG` locales obsoletas.
