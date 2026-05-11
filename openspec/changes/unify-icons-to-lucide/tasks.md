## 1. Core UI Components

- [ ] 1.1 Replace Feather/Material icons in `FloatingSearchBar.tsx` with Lucide equivalents (Search, Map, etc.).
- [ ] 1.2 Update `UserAvatar.tsx` to use Lucide for fallback initials or guest icons.
- [ ] 1.3 Refactor `AuthLayout.tsx` and `AuthPromptSheet.tsx` to use unified Lucide icons for close/back actions.
- [ ] 1.4 Update `SettingItem.tsx` and `SettingsGroup.tsx` to standardize icon weights.

## 2. Map Features

- [ ] 2.1 Replace icons in `AdaptiveControlOverlay.tsx` (Compass, Layers, Settings) with Lucide.
- [ ] 2.2 Update `POIPin.tsx` to use Lucide icons for category markers (Gate, Restaurant, etc.).
- [ ] 2.3 Refactor `CenteringButton.tsx` to use Lucide's `Crosshair` or `Navigation` icons.
- [ ] 2.4 Update `DiscoveryDashboard.tsx` category icons to Lucide.

## 3. Navigation & Specialized Views

- [ ] 3.1 Update `InstructionBanner.tsx` and `NavigationInfo.tsx` to ensure consistent Lucide stroke weights.
- [ ] 3.2 Refactor `RoutePlanningSheet.tsx` and `CustomRouteCard.tsx` to remove Material dependency.
- [ ] 3.3 Update `TicketCard.tsx` and `WalletStack.tsx` in the tickets feature.

## 4. Main Orchestration & Cleanup

- [ ] 4.1 Update `apps/mobile/app/(main)/index.tsx` explore icon to use Lucide.
- [ ] 4.2 Audit `apps/mobile/package.json` for unused icon dependencies (consider keeping `@expo/vector-icons` for now as some library internals might need it, but remove direct usage).
- [ ] 4.3 Final visual verification of all icons for consistent line weight and alignment.
