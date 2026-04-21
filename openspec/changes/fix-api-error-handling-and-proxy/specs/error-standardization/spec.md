## ADDED Requirements

### Requirement: Standardized Error Response Format
All backend services (Gateway, Auth, Geo, Social) SHALL return error responses using the standard `@app/core` schema.

#### Scenario: Proxy error in Gateway
- **WHEN** the Gateway fails to connect to a downstream service (e.g., Geo)
- **THEN** it returns a 502 status code with a JSON body: `{"error": {"message": "Geo service unreachable", "code": "SERVICE_UNREACHABLE", "details": "..."}}`

### Requirement: Resilient Error Parsing in Mobile App
The mobile `apiClient` SHALL be capable of extracting a human-readable message from both structured (`error.message`) and legacy/flat (`error`) error responses.

#### Scenario: Parsing structured error
- **WHEN** the API returns `{"error": {"message": "Custom error message"}}`
- **THEN** the `apiClient` throws an Error with the message "Custom error message"

#### Scenario: Parsing flat error
- **WHEN** the API returns `{"error": "Flat error message"}`
- **THEN** the `apiClient` throws an Error with the message "Flat error message"
