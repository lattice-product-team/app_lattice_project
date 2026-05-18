import { Callout } from 'nextra/components'

# Mobile Experience

The **Lattice Mobile Companion** is designed to provide attendees with a fluid, intuitive, and highly functional mobile experience. Built as a native React Native application using Expo, it delivers location-aware event discovery, accessible pedestrian navigation, and secure ticket management.

---

## 1. Onboarding and Authentication

Lattice prioritizes friction-free access. The entry gate allows users to log in or create accounts securely, restoring purchases and syncing active itineraries in seconds.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Welcome Portal</h4>
    <img src="/assets/screenshots/welcome.jpeg" alt="Welcome Screen" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Email Gateway</h4>
    <img src="/assets/screenshots/login-email.jpeg" alt="Email Login Screen" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Google SSO</h4>
    <img src="/assets/screenshots/login-google.jpeg" alt="Google Login Screen" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### Design Specifications
*   **Aesthetic Theme**: Minimalist dark backdrop accented with vibrant blue tones, avoiding visual clutter to ease focus.
*   **Input Usability**: Text boxes are optimized for thumb reach, featuring floating labels and native autocomplete.
*   **Single Sign-On (SSO)**: One-tap Google authentication leveraging Expo AuthSession, instantly linking external accounts.

---

## 2. Interactive Map Explorer and Discovery

The centerpiece of the Mobile Companion is the **Interactive Map Explorer**. Upon authentication, users are presented with a real-time map displaying geofenced events, paths, and active POIs.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Global Map Canvas</h4>
    <img src="/assets/screenshots/map.jpeg" alt="Central Map View" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Event Explorer Hub</h4>
    <img src="/assets/screenshots/explore-page.jpeg" alt="Discovery Feed" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### Design Specifications
*   **Geospatial Rendering**: MapLibre GL powers fluid, high-performance vector tile rendering, supporting 60fps rotation and tilt.
*   **Active Boundaries**: Color-coded geofences mark active event boundaries.
*   **Bottom Sheet Gestures**: The Event Explorer utilizes a custom interactive bottom sheet. Swiping up opens a clean, card-based event catalog.

---

## 3. Double-Sheet Event Details

Tapping on any active event boundary or discovery card triggers a context-aware, dual-level drawer that adapts to the user's intent.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Level 1 Drawer</h4>
    <img src="/assets/screenshots/event-lvl1.jpeg" alt="Event Level 1 Preview" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Level 2 Sheet</h4>
    <img src="/assets/screenshots/event-lvl2.jpeg" alt="Event Level 2 Full Details" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### Design Specifications
*   **Level 1 (Quick View)**: Displays the event title, operating hours, estimated distance, and actionable buttons to plan routes or view tickets.
*   **Level 2 (Expanded Sheet)**: Expands to full screen, displaying crowd density warnings, full stage schedules, accessibility summaries, and ticket checkout gates.

---

## 4. Smart Search and Filters

To quickly locate landmarks, facilities, and stages across complex venues, the app includes a robust search interface.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Quick Categories</h4>
    <img src="/assets/screenshots/search-bar-lvl2.jpeg" alt="Search Directory" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Autocomplete Search</h4>
    <img src="/assets/screenshots/search-bar-lvl3.jpeg" alt="Live Search" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### Design Specifications
*   **Quick Categories**: The search overlay features category tags (`Stages`, `Food & Drink`, `WCs`, `Medical`). Tapping a tag instantly filters active markers on the map.
*   **Offline Search Engine**: The autocomplete search queries the local SQLite database. This provides instant results even in areas with congested cellular networks.

---

## 5. Digital Wallet and Secure Tickets

The digital wallet manages ticket entries and scanning, serving as the user's primary key for venue access.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Wallet Directory</h4>
    <img src="/assets/screenshots/ticket-wallet.jpeg" alt="Ticket Wallet Overview" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Ticket Passcard</h4>
    <img src="/assets/screenshots/ticket.jpeg" alt="Secure Ticket details" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Scanner Portal</h4>
    <img src="/assets/screenshots/ticket-scan.jpeg" alt="Secure Checkin Camera" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### Design Specifications
*   **High-Contrast Presentation**: The ticket details view displays a high-contrast dynamic QR code. This ensures barcode scanners at entrance gates can read the ticket regardless of brightness levels.
*   **Gate Marshall Mode**: Tapping *Scan Gate* opens a secure camera view, allowing marshals to process entry checkpoints and validate transfers.

---

## 6. Turn-by-Turn Pedestrian Navigation and AR

Pedestrian navigation inside large venues requires specialized routing that goes beyond standard road maps. Lattice solves this with dedicated pathfinding and an augmented reality finder.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>Route Preview</h4>
    <img src="/assets/screenshots/navigation-mode.jpeg" alt="Navigation Preview" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Pedestrian Guidance</h4>
    <img src="/assets/screenshots/navigation-route.jpeg" alt="Active Guidance View" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
  <div style={{ textAlign: 'center' }}>
    <h4>Augmented Reality HUD</h4>
    <img src="/assets/screenshots/ra-mode.jpeg" alt="AR Navigation Mode" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### Design Specifications
*   **Smart Pedestrian Routing**: The routing engine calculates the optimal path along pedestrian walkways, bypassing vehicle-only roads.
*   **Turn-by-Turn Directions**: Displays clear headings (e.g., *"Turn left towards Main Stage in 50 meters"*), automatically recalculating the path if the user goes off course.
*   **Augmented Reality (AR) HUD**: For dense venues where traditional GPS coordinates fluctuate, users can activate AR Mode. This overlays virtual direction arrows and markers onto the live camera feed, guided by device gyroscopes and sensors.

---

## 7. Accessibility Profiles

Lattice is built with inclusivity at its core, offering dedicated tools to support mobility-impaired visitors.

<div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
  <div style={{ textAlign: 'center' }}>
    <h4>User Settings</h4>
    <img src="/assets/screenshots/user-profile.jpeg" alt="User Profile Details" width="220" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
  </div>
</div>

### Design Specifications
*   **Wheelchair Accessibility Profile**: When enabled, the routing algorithm automatically avoids steps, steep slopes, or gravel paths. Instead, it prioritizes paved walkways, ramps, and elevators, ensuring a safe and comfortable navigation experience.
*   **Facility Highlighting**: Tapping the wheelchair profile automatically highlights accessible restrooms, ramps, and dedicated viewing areas on the map.

<Callout type="info">
  **Accessibility Matters**: By keeping accessibility preferences synced with the routing engine, Lattice ensures all attendees can explore Barcelona's cultural events safely and independently.
</Callout>
