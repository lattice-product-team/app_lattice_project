## ADDED Requirements

### Requirement: Dependency Isolation
The monorepo SHALL NOT have `expo`, `react`, or `react-native` listed as dependencies in the root `package.json`.

#### Scenario: Clean root dependencies
- **WHEN** running `npm list expo` at the root
- **THEN** it SHALL NOT show a top-level dependency

### Requirement: Development Build Enforcement
The mobile application SHALL NOT attempt to provide fallbacks for native modules (like `expo-blur` or `react-native-mmkv`) when running in Expo Go.

#### Scenario: Runtime check for native modules
- **WHEN** the app starts
- **THEN** it SHALL verify that `react-native-mmkv` is available, otherwise show a "Development Build Required" screen.

### Requirement: Unified URL Scheme
The application SHALL use the `mobile` scheme for all deep linking and development server interactions.

#### Scenario: Launching via scheme
- **WHEN** opening a link with `exp+mobile://`
- **THEN** the development client SHALL open correctly.
