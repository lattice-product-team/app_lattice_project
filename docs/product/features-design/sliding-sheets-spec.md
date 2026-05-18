import { Callout } from 'nextra/components'

# Sliding Sheets & HUD Layout Specification

This specification defines the interactive behavior, hierarchy, visual states, and gesture logic of the sliding sheets (drawers) and floating HUD controls within the Lattice mobile application.

---

## 1. Primary Drawer (Top-Down Search Island)

The Primary Drawer operates from the top of the viewport downward. It manages the search hierarchy and main navigation actions across three distinct, user-controlled levels:

- **Level 1: Minimalist (ST - Semi-Transparent)**  
  Shows only the search input bar and the user profile avatar button. Uses a sleek, blur-enabled semi-transparent glassmorphism background to preserve visibility of the underlying map.
- **Level 2: Expanded Shortcuts (ST - Semi-Transparent)**  
  Includes quick-action filter chips (e.g., event categories, proximity filters) and nearby upcoming events. Maintains a semi-transparent background.
- **Level 3: Full-Screen Search (NT - Non-Transparent)**  
  Expands to occupy the complete viewport for detailed search queries, history, and comprehensive result listing. Uses a solid, non-transparent background to ensure readability of dense text overlays.

<Callout type="error">
**Golden Rule of Layout Orchestration:**  
If any secondary bottom drawer (Event Detail, Profile, Registration Callout) is activated, the Primary top drawer MUST collapse automatically to **Level 1** to prevent overlap and UI clutter.
</Callout>

---

## 2. Secondary Drawers (Bottom-Up Sheets)

Secondary components slide from the bottom of the viewport upward. They are categorized by context and purpose:

### A. Business & Event Detail Sheet

- **Level 1: Compact Overview (ST - Semi-Transparent)**  
  Renders key basic information: Title, Category, Action buttons ("How to Get There", "Directions"), and primary contact details.
- **Level 2: Extended Details (NT - Non-Transparent)**  
  Expands to a larger height, revealing extended text: media banners, full descriptions, social media profiles, and upcoming schedules. Uses a solid background for high readability.

### B. User Profile Sheet

- **Level 1: Quick Stats (ST - Semi-Transparent)**  
  Displays quick-action statistics: User name, account level, active notifications, and avatar badges.
- **Level 2: Account Console (NT - Non-Transparent)**  
  Expands to full detail: advanced metrics, historical attendance, and deep access to system settings.

### C. Registration & Account Notice

- **Level 1: Action Banner (ST - Semi-Transparent)**  
  A single, static mid-sized drawer. Explains the benefits of creating a permanent account and features a direct Registration CTA (Call to Action) button.

---

## 3. HUD Controls & Map Buttons

The persistent floating map controls follow strict layout rules relative to the sliding drawers:

- **Left Control Button (Exploration / Map Mode):**  
  Always visible on the screen. It is positioned behind the drawers on the Z-index axis, ensuring that it never overlaps drawer content but remains fully accessible when sheets are closed.
- **Right Control Buttons (3D Toggle / Recenter):**  
  Visible **exclusively** during Map Mode. These buttons are also positioned behind active drawers.

---

## 4. Visual Styles & Overlay Rules

We enforce a strict distinction between transparency levels to maintain a premium feel:

- **ST (Semi-Transparent):** Beautiful glassmorphism (background-blur, high border contrast, subtle shadows) to blend the interface seamlessly with the map.
- **NT (No Transparent):** Solid color backgrounds to optimize text legibility for heavy or dense content.

### The HUD Fade Effect

When any bottom-up drawer (whether ST or NT) moves upward and physically overlaps the bounding boxes of the floating HUD controls, the affected controls must perform a smooth **fade-out** animation until they are completely invisible.

- To eliminate visual noise, **no blur filter is applied to the buttons**; we use pure opacity fading to keep the transition clean.

---

## 5. Active Navigation Mode

During an active route navigation session, the layout alters dynamically to support the driving/walking context:

- **Primary Top Drawer:** Hidden completely from the viewport.
- **Navigation HUD Overlays:**
  - **Top Banner:** Active turn-by-turn routing instructions (maneuvers, street names).
  - **Bottom Banner:** Real-time route metrics (remaining time, remaining distance, ETA).
- **Floating Controls:** Replaced or hidden entirely to adapt to the navigation focus.

---

## 6. Gesture & Interaction Logic

- **Context-Aware Collapse:**  
  If the user is operating the Primary Search Drawer at **Level 3** (full screen) and initiates a trigger to open their Profile Sheet, the Search Drawer must immediately and smoothly collapse to **Level 1** before the Profile sheet slides up, establishing a clear visual transition priority.

---

## 7. Interactive Layout & Phase Visualizations

This section showcases the interactive mockups representing the visual transition levels (Level 1, 2, 3) for both top-down and bottom-up drawers, along with their active transparency transitions (ST vs. NT).

<div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '12px 0' }}>
  <img src="/assets/mockups/explore-1.png" alt="Top Search Drawer Expansion Phases" style={{ height: '540px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
  <img src="/assets/mockups/details-pois-1.png" alt="Bottom Detail Drawer Overview (Level 1)" style={{ height: '540px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
  <img src="/assets/mockups/details-pois-2.png" alt="Bottom Detail Drawer Fully Expanded (Level 2)" style={{ height: '540px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
</div>
