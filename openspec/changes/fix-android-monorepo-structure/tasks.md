## 1. Cleanup

- [x] 1.1 Delete the redundant `/app.json` file from the project root.
- [x] 1.2 Remove the invalid/test scripts from `apps/mobile/package.json` if they are no longer needed (e.g., `android:build:dev`).

## 2. Configuration Migration

- [x] 2.1 Move `apps/mobile/eas.json` to the project root `/eas.json`.
- [x] 2.2 Verify root `eas.json` does not contain invalid fields (remove `node` and `pnpm` versions for now to allow auto-detection).

## 3. Script Standardization

- [x] 3.1 Update root `package.json` scripts to run EAS build from the root context.
- [x] 3.2 Add a `mobile:android:build` shorthand to root `package.json`.
