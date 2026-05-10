## ADDED Requirements

### Requirement: JWT Handshake Authentication
The WebSocket server SHALL require a valid JWT token during the initial connection handshake.

#### Scenario: Successful Authenticated Connection
- **WHEN** a client provides a valid JWT in the `auth` object of the Socket.io connection
- **THEN** the server SHALL accept the connection and associate the socket with the user's identity.

#### Scenario: Rejected Unauthenticated Connection
- **WHEN** a client attempts to connect without a token or with an invalid token
- **THEN** the server SHALL reject the connection with an "Authentication error".

### Requirement: Redis Pub/Sub Scaling
The WebSocket server SHALL use the Redis adapter to synchronize events across multiple server instances.

#### Scenario: Multi-Instance Broadcast
- **WHEN** an event is emitted on Server Instance A
- **THEN** Server Instance B SHALL receive the event via Redis and broadcast it to its connected clients.

### Requirement: Connection Health Management
The system SHALL implement a robust heartbeat mechanism to detect and handle stale connections.

#### Scenario: Automatic Reconnection
- **WHEN** a client loses connectivity
- **THEN** the Socket.io client SHALL attempt to reconnect automatically with exponential backoff.
