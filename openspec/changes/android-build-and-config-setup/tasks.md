## 1. Android Foundation

- [x] 1.1 Update `app.json` with the Android package name (`com.lattice.app`).
- [x] 1.2 Configure Android-specific icons and splash screen paths in `app.json`.
- [x] 1.3 Add necessary Android permissions (Location, Internet) to `app.json`.

## 2. EAS Cloud Configuration

- [x] 2.1 Initialize/Update `eas.json` with `development`, `preview`, and `production` profiles for Android.
- [x] 2.2 Configure `development` profile to use `developmentClient: true`.
- [x] 2.3 Configure `preview` profile to use `buildType: "apk"`.

## 3. Automation & Secrets

- [x] 3.1 Add `android:dev`, `android:preview`, and `android:prod` scripts to `apps/mobile/package.json`.
- [x] 3.2 Document the `eas secret:create` command needed for `MAPTILER_KEY`.
- [x] 3.3 Verify `app.json` contains the correct `expo.extra` fields for environment variable mapping.
