## 1. Backend Hooks (API)

- [ ] 1.1 Add `notifyAll` signals to `updatePoi` and `deletePoi` in `geo.controller.ts`
- [ ] 1.2 Add `notifyAll` signals to `updateEvent` and `deleteEvent` in `geo.controller.ts`
- [ ] 1.3 Verify that `notifyAdmin` and `notifyAll` are correctly broadcasting via Socket.io

## 2. Mobile Integration

- [ ] 2.1 Create `RealtimeSyncProvider.tsx` in `apps/mobile/src/providers/`
- [ ] 2.2 Implement Socket.io listeners for `sync:events`, `sync:pois`, and `sync:event:spatial`
- [ ] 2.3 Integrate `queryClient.invalidateQueries` within the listeners to refresh POIs and Events
- [ ] 2.4 Wrap the main application in `RealtimeSyncProvider` within `apps/mobile/app/_layout.tsx`

## 3. Verification & Testing

- [ ] 3.1 Verify real-time update on mobile after modifying a POI in Admin Web
- [ ] 3.2 Verify real-time update on mobile after creating a new Event in Admin Web
- [ ] 3.3 Ensure that background/foreground app state transitions correctly re-establish sync
