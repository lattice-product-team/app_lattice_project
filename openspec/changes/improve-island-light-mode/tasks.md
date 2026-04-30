## 1. Cleanup and Preparation

- [ ] 1.1 Identify and list all hardcoded color values in `DiscoveryDashboard.tsx`
- [ ] 1.2 Identify and list all hardcoded color values in `AdaptiveControlOverlay.tsx`
- [ ] 1.3 Identify and list all hardcoded color values in `index.tsx`

## 2. Component Refactoring

- [ ] 2.1 Update `DiscoveryDashboard.tsx` to use `theme.colors.glass.background` and `theme.colors.glass.border` for category pills
- [ ] 2.2 Update `DiscoveryDashboard.tsx` text and icon colors to use `theme.colors.text.secondary`
- [ ] 2.3 Update `AdaptiveControlOverlay.tsx` to use `theme.colors.text.primary` for icons
- [ ] 2.4 Update `index.tsx` to ensure `SafeBlurView` uses `theme.colors.glass.tint` for its tint prop

## 3. Verification

- [ ] 3.1 Verify accessibility and contrast in Dark Mode
- [ ] 3.2 Verify accessibility and contrast in Light Mode
- [ ] 3.3 Ensure no regression in blurred background appearance
