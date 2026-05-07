## Context

La aplicación móvil utiliza `react-native-reanimated` para las animaciones, pero los parámetros de física se definen localmente en cada componente. Esto ha generado una inconsistencia visual y una dificultad operativa para ajustar la fluidez de la interfaz.

## Goals / Non-Goals

**Goals:**

- Crear un sistema de tokens de movimiento centralizado.
- Unificar la "sensación" táctil de la aplicación.
- Facilitar ajustes globales de física desde un solo archivo.

**Non-Goals:**

- Cambiar las librerías de animación existentes.
- Rediseñar los componentes visuales.

## Decisions

### 1. Definición de Presets de Física

Se establecen 4 categorías principales de movimiento:

| Token            | Propósito                  | Configuración Propuesta                      |
| :--------------- | :------------------------- | :------------------------------------------- |
| **`magnetic`**   | Paneles, arrastres pesados | `{ damping: 38, stiffness: 170, mass: 1.0 }` |
| **`responsive`** | Botones, feedback táctil   | `{ damping: 20, stiffness: 200 }`            |
| **`snappy`**     | Modales, aperturas rápidas | `{ damping: 25, stiffness: 150 }`            |
| **`gentle`**     | Opacidades, sutiles        | `{ damping: 30, stiffness: 100 }`            |

### 2. Ubicación de los Tokens

**Decisión**: Integrar los tokens directamente en el objeto `LatticeTheme`.
**Racional**: Permite acceder a ellos mediante el hook `useAppTheme()` que ya está ampliamente distribuido en la aplicación, minimizando la necesidad de nuevos imports.

## Risks / Trade-offs

- **[Riesgo]** → La refactorización de muchos componentes puede introducir errores si no se prueba cada transición.
- **[Mitigación]** → Mantener los valores actuales como base para los nuevos tokens antes de ajustarlos.
