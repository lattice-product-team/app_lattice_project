# Specification: Passkey Vault

This specification defines the implementation of FIDO2/WebAuthn Passkeys for biometric authentication in the Lattice application.

## 1. Registration Flow (After Social Login)

### 1.1 Trigger
Immediately after a successful first-time social login, or via profile settings.

### 1.2 Mechanism
1. **Challenge**: Backend generates a random challenge and returns it to the mobile app.
2. **Native Prompt**: Mobile app uses `react-native-passkey` or `expo-local-authentication` (depending on platform support) to create a new credential.
3. **Attestation**: Mobile app sends the public key and signed challenge back to the Backend.
4. **Storage**: Backend verifies the signature and stores the credential ID and public key linked to the user.

## 2. Login Flow (Returning User)

### 2.1 Trigger
A "Sign in with Passkey" button on the login screen or an automatic prompt if a passkey is detected for the device.

### 2.2 Mechanism
1. **Assertion Request**: Backend provides a challenge.
2. **Biometric Auth**: User authenticates with FaceID/TouchID.
3. **Verification**: Backend verifies the signature and issues a Lattice JWT.

## 3. Data Model
- **Credential Table**:
    - `id`: string (Credential ID)
    - `userId`: number (FK to Users)
    - `publicKey`: string (PEM or base64)
    - `counter`: number (for replay protection)
    - `createdAt`: timestamp

## 4. Scenarios

#### Scenario: Registering a Passkey
- GIVEN an authenticated user
- WHEN they opt-in to Passkeys
- THEN they are prompted for biometrics AND a public key is securely stored on the server.

#### Scenario: Login with Passkey
- GIVEN a user who has a passkey registered
- WHEN they click "Login with Passkey"
- THEN they use biometrics to sign in AND get a valid session without typing an email or password.
