## ADDED Requirements

### Requirement: Disparo de Animación en Orquestación

La orquestación de eventos y POIs SHALL emitir el origen del evento de selección para permitir que el sistema de cámara decida el tipo de transición.

#### Scenario: Selección desde exploración

- **WHEN** un usuario selecciona un Evento desde el `DiscoveryDashboard`
- **THEN** la señal de selección DEBE incluir el flag `triggerSource: 'exploration'`
- **THEN** el orquestador DEBE asegurar que el `MapCameraManager` reciba esta señal para ejecutar un `flyTo`.
