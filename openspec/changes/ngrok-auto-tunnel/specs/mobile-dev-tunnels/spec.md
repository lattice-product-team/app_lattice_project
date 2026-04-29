## ADDED Requirements

### Requirement: Automated Ngrok Tunnel Generation
The system SHALL start `ngrok` using a YAML configuration that exposes both Metro Bundler (port 8081) and the API Gateway (port 3000) simultaneously.

#### Scenario: Running the dev script
- **WHEN** the developer runs `pnpm dev:ngrok` in the mobile app directory
- **THEN** ngrok starts in the background and two tunnels are established

### Requirement: Dynamic URL Extraction
The system SHALL automatically query the ngrok local API to retrieve the dynamically generated public URLs for the `metro` and `api` tunnels.

#### Scenario: Extracting URLs from local API
- **WHEN** ngrok is running and tunnels are established
- **THEN** the script fetches `http://localhost:4040/api/tunnels` and parses the JSON response using Node.js to extract the public URLs

### Requirement: Environment Variable Injection
The system SHALL inject the extracted ngrok URLs as environment variables (`EXPO_PACKAGER_PROXY_URL` and `EXPO_PUBLIC_API_URL`) before starting the Expo bundler.

#### Scenario: Starting Expo with injected URLs
- **WHEN** the ngrok URLs have been successfully extracted
- **THEN** `EXPO_PACKAGER_PROXY_URL` is set to the Metro tunnel URL and `EXPO_PUBLIC_API_URL` is set to the API tunnel URL (appended with `/api/v1`), and `npx expo start` is executed.
