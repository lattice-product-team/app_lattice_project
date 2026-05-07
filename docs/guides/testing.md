# Testing & Quality Assurance - Lattice

Protocolo para garantizar la fiabilidad del sistema en el monorepo.

## 1. Pipeline de CI/CD

Hemos unificado la calidad y el despliegue en un solo flujo (`.github/workflows/deploy-backend.yml`).

- **Quality Gate:** Antes de cada despliegue o PR, se ejecuta automáticamente: `Lint -> TypeCheck -> Tests`.
- **Despliegue Automático:** Solo si la fase de Quality pasa con éxito y estamos en `main`.

## 2. Ejecución de Tests

Puedes ejecutar los tests desde la raíz del proyecto usando `pnpm`:

| Comando                    | Descripción                                            |
| :------------------------- | :----------------------------------------------------- |
| `pnpm test`                | Ejecuta todos los tests del monorepo (Lógica y UI).    |
| `pnpm lint`                | Verifica el estilo de código en todo el proyecto.      |
| `pnpm build`               | Valida que TypeScript no tenga errores de tipos.       |
| `pnpm turbo lint -- --fix` | Arregla automáticamente errores de formato y Prettier. |

## 3. Tipos de Tests en el Proyecto

### A. Tests de Lógica (Vitest)

Ubicados en `apps/server/*/` y `apps/mobile/src/utils/__tests__/`.

- **Enfoque:** Algoritmos, servicios y lógica pura.
- **Mocking:** Usamos `vi.mock` para simular la base de datos en la mayoría de casos.

### B. Tests de Integración de Base de Datos (Testcontainers)

Ubicados en `packages/db/__tests__/`.

- **Requisito:** Requiere **Docker** activo.
- **Funcionamiento:** Levanta un contenedor efímero de Postgres, ejecuta las migraciones y valida queries reales contra la DB.
- **Comando:** `pnpm --filter @app/db test`.

### C. Tests de Gateway (Proxy & Routing)

Ubicados en `apps/server/gateway/__tests__/`.

- **Enfoque:** Validar que las rutas `/api/v1/*` se redirigen correctamente y que los health-checks funcionan.

### D. Tests de UI (Jest + RNTL)

Ubicados en `apps/mobile/src/components/__tests__/`.

- **Enfoque:** Renderizado de componentes React Native y navegación.

## 4. Guía para el Desarrollador

1. **Antes de subir código:** Ejecuta `pnpm lint` y `pnpm test`.
2. **Si el lint falla:** Ejecuta `pnpm turbo lint -- --fix`.
3. **Nuevos servicios:** Siempre añade un archivo `vitest.config.ts` y exporta la instancia de `app` para facilitar los tests sin colisión de puertos.

---

> [!IMPORTANT]
> El Pipeline de CI rechazará cualquier código que no pase los tests o el linting. ¡Mantén el código limpio!
