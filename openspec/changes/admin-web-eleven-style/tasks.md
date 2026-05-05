## 1. Design System & Tokens Setup

- [x] 1.1 Define Tailwind v4 `@theme` variables in `globals.css` for ElevenLabs color system (Eggshell, Powder, Chalk, Gravel, Obsidian).
- [x] 1.2 Implement the "Waldenburg" (Cormorant Garamond/Libre Baskerville) and "Inter" typography system with specific tracking/weight values.
- [x] 1.3 Add custom utility classes for "subtle-shadow" (hairline elevation) and pill-radius.

## 2. Core Component Redefinition

- [x] 2.1 Refactor `Button` component styles to enforce 9999px pill-shape and achromatic palette.
- [x] 2.2 Update `Input` component to use editorial sharp 0px radius and appropriate border/background tokens.
- [x] 2.3 Implement the "Floating Product Demo Card" wrapper with 16px radius and hairline shadow.

## 3. Dashboard & Page Restyling

- [x] 3.1 Update `layout.tsx` to use the "Eggshell" (#fdfcfc) base ground and the new navigation bar style.
- [x] 3.2 Refactor the main Dashboard (`page.tsx`) to use Waldenburg headlines and the "hover" card layout.
- [x] 3.3 Apply the ElevenLabs achromatic discipline to the `Events`, `Venues`, `Map`, and `Radar` pages.

## 4. Verification & Polish

- [x] 4.1 Audit all pages for legacy hardcoded colors and replace them with the new token system.
- [x] 4.2 Verify typography scale and tracking against the "Waldenburg 300" editorial requirements.
- [x] 4.3 Final visual walk-through to ensure "severe yet warm" aesthetic consistency.
