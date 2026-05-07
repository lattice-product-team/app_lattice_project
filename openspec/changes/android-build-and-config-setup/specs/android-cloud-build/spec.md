## ADDED Requirements

### Requirement: Android Application Identity
The application SHALL be uniquely identified on the Android platform to allow for installation and Play Store compatibility.

#### Scenario: Unique Package Name
- **WHEN** the application is compiled for Android
- **THEN** it SHALL use the package name `com.lattice.app`

### Requirement: Remote Build Profiles
The system SHALL provide pre-configured EAS profiles for different stages of the development lifecycle.

#### Scenario: Development Build Generation
- **WHEN** the user triggers a build with the `development` profile
- **THEN** the system SHALL generate an APK containing the `expo-dev-client` for over-the-air debugging

#### Scenario: Preview APK Generation
- **WHEN** the user triggers a build with the `preview` profile
- **THEN** the system SHALL generate a standalone installable APK (Release build)

### Requirement: Secure Environment Injection
The remote build system SHALL securely inject environment variables required for third-party services.

#### Scenario: MapTiler Key Injection
- **WHEN** a build is triggered in the EAS cloud
- **THEN** the system SHALL inject the `MAPTILER_KEY` from EAS Secrets into the application bundle
