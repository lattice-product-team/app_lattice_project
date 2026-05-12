## 1. Core UI Components

- [x] 1.1 Replace Feather/Material icons in `FloatingSearchBar.tsx` with Lucide equivalents (Search, Map, etc.).
- [x] 1.2 Update `UserAvatar.tsx` to use Lucide for fallback initials or guest icons.
- [x] 1.3 Refactor `AuthLayout.tsx` and `AuthPromptSheet.tsx` to use unified Lucide icons for close/back actions.
- [x] 1.4 Update `SettingItem.tsx` and `SettingsGroup.tsx` to standardize icon weights.

## 2. Map Features

- [x] 2.1 Replace icons in `AdaptiveControlOverlay.tsx` (Compass, Layers, Settings) with Lucide.
- [x] 2.2 Update `POIPin.tsx` to use Lucide icons for category markers (Gate, Restaurant, etc.).
- [x] 2.3 Refactor `CenteringButton.tsx` to use Lucide's `Crosshair` or `Navigation` icons.
- [x] 2.4 Update `DiscoveryDashboard.tsx` category icons to Lucide.

## 3. Navigation & Specialized Views

- [x] 3.1 Update `InstructionBanner.tsx` and `NavigationInfo.tsx` to ensure consistent Lucide stroke weights.
- [x] 3.2 Refactor `RoutePlanningSheet.tsx` and `CustomRouteCard.tsx` to remove Material dependency.
- [x] 3.3 Update `TicketCard.tsx` and `WalletStack.tsx` in the tickets feature.

## 4. Main Orchestration & Cleanup

- [x] 4.1 Update `apps/mobile/app/(main)/index.tsx` explore icon to use Lucide.
- [x] 4.2 Audit `apps/mobile/package.json` for unused icon dependencies (consider keeping `@expo/vector-icons` for now as some library internals might need it, but remove direct usage).
- [x] 4.3 Final visual verification of all icons for consistent line weight and alignment.
