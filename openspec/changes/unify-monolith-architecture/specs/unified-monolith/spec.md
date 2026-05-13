# Unified Server Architecture

The server must function as a single consolidated package that provides all existing API, Auth, Geo, and Social functionality.

## Requirements

1. **Single Entry Point**: All server services must be reachable through the main API entry point.
2. **Unified Build**: The entire server codebase must be buildable with a single command.
3. **Environment Parity**: The unified structure must work identically in local development and production Docker environments.
4. **Dependency Consolidation**: Shared dependencies must be managed at the root of the unified package.
5. **No Functional Regression**: All existing routes, controllers, and middlewares must remain functional after the move.
