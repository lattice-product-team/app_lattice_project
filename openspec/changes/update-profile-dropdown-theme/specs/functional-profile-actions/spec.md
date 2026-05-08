## MODIFIED Requirements

### Requirement: Acciones del Perfil en Contexto Dropdown
Las acciones funcionales del perfil (configuración, navegación) SHALL ser accesibles desde la interfaz de `ProfileDropdown` en lugar de una pantalla independiente.

#### Scenario: Acceso a Configuración
- **WHEN** el usuario pulsa el icono de engranaje en el `ProfileDropdown`
- **THEN** el sistema debe abrir el menú de configuración o navegar a la sección correspondiente, manteniendo la coherencia con el estado de la "Island".

#### Scenario: Cerrar Sesión desde Dropdown
- **WHEN** el usuario selecciona "Cerrar Sesión" dentro de las opciones del perfil expandido
- **THEN** se debe ejecutar `useAuthStore.getState().logout()` y cerrar el desplegable.
