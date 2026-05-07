## Context

El componente `AdaptiveControlOverlay` actúa como el HUD principal de navegación en el mapa. La versión actual utiliza botones individuales o un contenedor con espaciado irregular. Las capturas de pantalla proporcionadas indican la necesidad de un diseño más cohesivo, similar al centro de control de iOS o los mapas de Apple, donde las acciones se agrupan en una "píldora" vertical con separadores internos.

## Goals / Non-Goals

**Goals:**

- Implementar un contenedor vertical unificado con bordes redondeados pronunciados (estilo píldora).
- Asegurar que cada botón ocupe el ancho total del contenedor para maximizar el área de impacto.
- Añadir líneas divisorias horizontales de 0.5px de grosor entre cada acción.
- Garantizar una alineación central perfecta de los iconos.

**Non-Goals:**

- Cambiar la lógica de negocio de los botones (recenter, 3D toggle, etc.).
- Cambiar la posición global del HUD en la pantalla (se mantiene a la derecha sobre la Island).

## Decisions

### 1. Estructura de Contenedor Unificado

Utilizaremos un único `SafeBlurView` (o un contenedor con `BlurView`) para agrupar los tres botones. Esto reduce la fragmentación visual y permite aplicar un único borde redondeado coherente.

### 2. Dimensiones y Áreas de Impacto

- **Ancho**: Se fijará en 50px para asegurar un buen target táctil sin obstruir demasiado el mapa.
- **Altura de Item**: Cada botón tendrá una altura mínima de 48-52px.
- **HitSlop**: Aunque el área visual sea el contenedor, el `Pressable` interno se extenderá para cubrir todo su sector, eliminando "zonas muertas" entre botones.

### 3. Implementación de Separadores

Insertaremos un componente `<View style={styles.separator} />` entre los elementos del array de botones.

- **Estilo**: `height: 0.5`, `backgroundColor: 'rgba(255, 255, 255, 0.2)'`, `width: '80%'`.

### 4. Alineación de Iconos

Cada botón será un contenedor `flex` con `justifyContent: 'center'` y `alignItems: 'center'` para asegurar que tanto el texto "2D/3D" como los iconos de `Feather` estén perfectamente alineados.

## Risks / Trade-offs

- **[Riesgo]**: Superposición con elementos de la capa de mapa si el ancho es excesivo.
- **[Mitigación]**: Mantener el ancho en un máximo de 54px, que es el estándar para controles laterales en aplicaciones de mapas móviles.
