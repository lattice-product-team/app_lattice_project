## 1. Map Cleanup & Visibility

- [x] 1.1 Update `MapContent.tsx` with comprehensive `layersToHide` list (transit, education, medical, etc.)
- [x] 1.2 Verify all native POIs are hidden in both Light and Dark modes
- [x] 1.3 Fix the duplicate theme import bug in `app/(main)/index.tsx`

## 2. Icon System Refactor

- [x] 2.1 Update `CategoryMetadata` interface in `poiUtils.ts` to include `iconFamily`
- [x] 2.2 Update `CATEGORY_MAP` and `EVENT_CATEGORY_MAP` in `poiUtils.ts` with correct families and icon names
- [x] 2.3 Refactor `CategoryChip`, `POICarousel`, and `EventCarousel` to handle multi-family icons
- [x] 2.4 Verify console is clear of "invalid icon name" warnings

## 3. Apple Design Activation

- [x] 3.1 Update `MapHUD.tsx` to use `FloatingSearchBar` instead of legacy `SearchBar`
- [x] 3.2 Adjust `MapBottomSheet` top border radius to 32pt for a more premium look
- [x] 3.3 Ensure `FloatingSearchBar` correctly triggers search state and is properly positioned within the sheet

## 4. Legacy Cleanup

- [x] 4.1 Delete `apps/mobile/src/components/map/` directory and all its contents
- [x] 4.2 Delete old `SearchBar.tsx` and `FilterChip.tsx` from `src/components/`
- [x] 4.3 Update `tasks.md` in `mobile-architecture-overhaul` to mark migrated steps as done
