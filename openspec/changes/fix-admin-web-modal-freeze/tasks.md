## 1. Fix Modal Crashes

- [x] 1.1 Rename `ModalContainer` to `ModalContent` in `apps/admin-web/src/app/events/page.tsx`.
- [x] 1.2 Rename `ModalContainer` to `ModalContent` in `apps/admin-web/src/app/pois/page.tsx`.
- [x] 1.3 Update imports in both files to reflect the change.

## 2. Refactor Select Components

- [x] 2.1 Refactor `Select` in `apps/admin-web/src/app/pois/page.tsx` to use the standard HeroUI API (`Select` and `SelectItem`).
- [x] 2.2 Refactor `Select` in `apps/admin-web/src/app/radar/page.tsx` to use the standard HeroUI API.
- [x] 2.3 Implement guarded selection handlers in both pages to prevent infinite loops.

## 3. Stabilize Map Rendering

- [x] 3.1 Implement dynamic import for `AdminMap` in `apps/admin-web/src/app/events/page.tsx` with `ssr: false`.
- [x] 3.2 Implement dynamic import for `AdminMap` in `apps/admin-web/src/app/pois/page.tsx` with `ssr: false`.
- [x] 3.3 Verify that `AdminMap` handles resize events correctly when initialized inside a visible modal.

## 4. Verification

- [x] 4.1 Verify that the Event Creation modal opens without crashing or freezing.
- [x] 4.2 Verify that the POI Registration modal opens without crashing or freezing.
- [x] 4.3 Verify that selecting an event in the POI form updates the map boundary correctly.
- [x] 4.4 Verify that the Radar page remains functional after the Select refactor.
