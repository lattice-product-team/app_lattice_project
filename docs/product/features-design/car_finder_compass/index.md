# Car Finder Compass

The **Car Finder Compass** is a dedicated high-utility tool designed to relieve the stress of losing a parked vehicle in massive parking lots (e.g., race tracks or festival grounds). It offers an ultra-focused, high-contrast directional guide that relies heavily on device magnetometer telemetry.

## Screen Mockups

````carousel
![Radar Compass Navigation](../../assets/mockups/navigation-2.png)
````


## Interactive Design Details

*   **Pulsing Magnetic Dial**: Features a central glassmorphism dial overlaying concentric pulsing red sensor rings that grow and fade dynamically, providing reassuring feedback that the signal is active.
*   **360° Cardinal Compass HUD**: Displays a rotating needle anchored to North, with cardinal indicators (N, S, E, W) and high-visibility digital distance readouts (*125 Meters*) centered inside the glass dial.
*   **Dynamic Directive Toasts**: Emphasizes direct actions based on bearing (e.g., *"Walk Forward"* with a prominent red up-arrow).
*   **Location Metadata Card**: Embeds a dark mini-map layout showing precise parking spot details (*Dodger Stadium Parking • Level B2 • Pinned 2h ago*), with edit controls to adjust position manually.
*   **Quick Action Footer Grid**:
    *   **Flashlight**: Toggles mobile camera flash for navigating dark parking sections.
    *   **Honk**: Triggers the linked smart vehicle horn/lights telemetry to locate it by sound/sight.
    *   **Panic**: Activates a high-volume acoustic alert or contacts venue emergency services in case of safety incidents.

---

> [!TIP]
> The HTML prototype of this screen can be found in the repository at [code.html](./code.html).
