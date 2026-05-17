# Circuit Map & Search

The **Circuit Map & Search** is the central geographical navigation hub for end-users, built to cleanly render large-scale track maps and provide rapid fuzzy searching for venue Points of Interest (POIs).

## Screen Mockup

![Circuit Map & Search Screen](./screen.png)

## Interactive Design Details

*   **Dark-Mode High-Contrast Map**: Simulates a sleek, dark vector map underlay with a striking red glowing racetrack overlay (`track-glow` SVG) representing the venue boundaries (e.g., Silverstone Circuit).
*   **Animated User Position Marker**: A primary red location dot equipped with a continuous pulsing locator ring (`animate-ping`) showing exact real-time client placement.
*   **Persistent Header Controls**:
    *   **Unified Search input**: Custom input box featuring mic search integration and immediate search state response.
    *   **AR Swapper**: Fast access toggle to switch straight to standard camera AR HUD navigation.
    *   **Horizontal Filter Chips**: Responsive horizontal list of category buttons (Grandstands, Food, Parking, Merch, Toilets) to filter markers instantaneously.
*   **Interactive Selected POI Card (Bottom Sheet)**:
    *   Exhibits categoric tags (*Food Court*), live status indicator (*Open Now* in glowing green), name (*Paddock Club Grill*), and walking distance statistics.
    *   Includes a horizontal scrolling photo gallery of the selected spot.
    *   Provides quick-access primary buttons for **"Navigate Here"** and **"Share"**.
*   **Primary Bottom Navigation Bar**: Anchors global mobile routing tabs: Home, Schedule, Map, and Profile.

---

> [!TIP]
> The HTML prototype of this screen can be found in the repository at [code.html](file:///home/nildiaz/app_lattice_project/docs/product/features-design/circuit_map_\%26_search/code.html).
