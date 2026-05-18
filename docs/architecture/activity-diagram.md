import { Callout } from 'nextra/components'

# Activity Diagrams

This section details the operational workflows, state transitions, and interactive processes governing both the **Lattice Mobile Application** and the **Lattice Administration Web Platform (Web-Admin)**.

---

## Mobile Client Workflows

This diagram models the lifecycle and dynamic state transitions of the **Lattice Mobile Client** (React Native / Expo), tracing operations from initialization to active pedestrian guidance and gyroscope-responsive Augmented Reality views.

```mermaid
flowchart TD
    %% 1. Startup & Prep
    Start(["App Opened"]) --> NavigationReady{"Navigation State Ready?"}
    NavigationReady -- No --> WaitNav["Wait for navigationState.key"] --> NavigationReady
    NavigationReady -- Yes --> Prefetch["Launch Data Pre-fetch: events-search & POIs"]
    Prefetch --> TimeoutCheck{"Pre-fetch complete\nor 5s Safety Timeout?"}
    TimeoutCheck -- Yes --> SetDataReady["Set isDataReady = true"]
    SetDataReady --> CheckAuth{"Session Token or\nGuest Mode active?"}

    %% 2. Auth & Onboarding Branching
    CheckAuth -- Yes --> GoToMain["replace /(main)"]
    CheckAuth -- No --> GoToOnboarding["replace /(auth)/onboarding"]

    %% Onboarding Flow
    subgraph Onboarding ["Onboarding Screen"]
        GoToOnboarding --> ViewSlides["View Slides 1-3 with motion interpolations"]
        ViewSlides --> ActionSelect{"User Action"}
        ActionSelect -- "Continue as Guest" --> SetGuest["setGuestMode_true & setLastScreenMode_0"]
        SetGuest --> GoToMain
        ActionSelect -- "Get Started" --> GoToLogin["push /(auth)/login"]
    end

    subgraph Authentication ["Authentication Screen"]
        GoToLogin --> LoginSelect{"Auth Mode"}
        LoginSelect -- "Social Auth" --> GoogleApple["Google / Apple SSO"]
        LoginSelect -- "Email Login" --> EmailScreen["Email Credentials"]
        GoogleApple --> VerifySuccess{"Verify Success?"}
        EmailScreen --> VerifySuccess
        VerifySuccess -- Yes --> ClearGuest["setGuestMode_false"] --> GoToMain
        VerifySuccess -- No --> LoginError["Show Alert Error"] --> LoginSelect
    end

    %% 3. Main Dashboard Layout
    subgraph MainDashboard ["Main Canvas Dashboard"]
        GoToMain --> CheckScreenMode{"screenMode.value"}

        %% Explore Mode
        CheckScreenMode -- "0 (Explore)" --> RendersExplore["Renders DiscoveryFeed"]
        RendersExplore --> ClickFeedItem["Click Event/POI Item"]
        ClickFeedItem --> SwitchToMap["Auto-switch screenMode.value to 1"]

        %% Map Mode
        CheckScreenMode -- "1 (Map)" --> RendersMap["Renders MapContent via MapLibreGL"]
        SwitchToMap --> RendersMap

        %% Mode Toggle Action
        RendersMap --> DragToggle["Drag/Press Bottom-Left Mode Pill"]
        DragToggle --> SwitchToExplore["Switch screenMode.value to 0"]
        SwitchToExplore --> RendersExplore
    end

    %% 4. Top Search Island & Drawer Gestures
    subgraph SearchIsland ["Top Search Island Drawer"]
        RendersMap --> DetectPan["Detect Gesture.Pan on Search Island"]
        DetectPan --> SnapLevels{"Evaluate Drag Snaps"}

        SnapLevels -- "Level 1 (islandState = 0.0)" --> CollapsedSearch["Collapsed Search Bar + Profile Button"]
        SnapLevels -- "Level 2 (islandState = 0.5)" --> DashboardSearch["Renders DiscoveryDashboard: categories & recommended POIs"]
        SnapLevels -- "Level 3 (islandState = 1.0)" --> FullSearch["Renders SearchExperience: query typing & search history"]

        %% Anti-Skip Protection
        DetectPan -.-> AntiSkip["Anti-Skip Constraint: Forces user to drag through 0.5 first"]

        %% Profile sheet accessibility trigger
        CollapsedSearch --> ClickProfile["Press Profile Button"]
        ClickProfile --> ProfileSheet["Slide-out ProfileSheet"]
        ProfileSheet --> AccessibilityToggles["Configure Toggles: Avoid Stairs / Avoid Crowds / Wheelchair Mode"]
    end

    %% 5. Event Detail & Route Planning Sheets
    subgraph RoutePlanning ["Route Selection & Planning"]
        RendersMap --> TapMapMarker["Tap Event/POI Marker"]
        TapMapMarker --> OpenDetail["Open EventDetailSheet / POI Drawer"]
        OpenDetail --> ClickDirections["Click Get Directions"]

        ClickDirections --> PlanningMode["Transition UIState to MapUIState.PLANNING"]
        PlanningMode --> OpenPlanning["Open RoutePlanningSheet"]
        OpenPlanning --> FetchRoutes["Concurrent Route Fetch: driving, walking & bicycle"]
        FetchRoutes --> DisplayRouteVariants["Render route path options & ETAs"]
        DisplayRouteVariants --> SelectTransport["Change Transport Mode Profile"]
    end

    %% 6. Active Navigation Flow
    subgraph ActiveNavigation ["Active Guidance Mode"]
        DisplayRouteVariants --> ClickStartNav["Click Start Navigation"]
        ClickStartNav --> StartNavStore["trigger startNavigation store action"]

        StartNavStore --> UpdateNavState["isPlanning = false, isNavigating = true"]
        UpdateNavState --> SetUINav["setUIState to MapUIState.NAVIGATING"]
        SetUINav --> CollapseIsland["Collapse Top Search Island to 0.0"]
        CollapseIsland --> ClearSelections["Clear selectedPoi & selectedEvent to prevent occlusion"]

        ClearSelections --> NavigationHUDs["Render Active Navigation HUDs"]
        NavigationHUDs --> InstructionBanner["Render InstructionBanner: turn instructions"]
        NavigationHUDs --> NavigationInfo["Render NavigationInfo: distance, duration & destination name"]

        %% Navigation Controls
        NavigationHUDs --> NavActions{"User Actions"}
        NavActions -- "Press Recenter" --> TriggerRecenter["Trigger Recenter Count: Snap camera to passive follow"]
        NavActions -- "Press Stop Navigation" --> StopNav["stopNavigation: Returns user to PLANNING state"]
        NavActions -- "Press Close Route" --> ClearNav["clearNavigation: Exits to EXPLORING base map"]
    end

    %% 7. Augmented Reality HUD Overlay
    subgraph ARHud ["Adaptive AR Navigation HUD"]
        NavigationHUDs --> WatchMotion["Poll DeviceMotion beta/gamma at 60fps"]
        WatchMotion --> CheckTilt{"Phone beta tilt in range 45 - 135 degrees?"}

        CheckTilt -- No (Flat) --> KeepHidden["Keep AR Overlay hidden / Renders standard map"]
        CheckTilt -- Yes (Upright) --> LaunchAROverlay["Launch AROverlay"]

        LaunchAROverlay --> LockPortrait["Lock screen orientation to strict Portrait Up"]
        LockPortrait --> StartCam["Start Expo CameraView background feed"]
        StartCam --> CanvasScene["Load MainARScene on background Canvas"]

        CanvasScene --> OverlayLabels["Project 2D screen overlay labels based on bearing"]
        OverlayLabels --> HeadingCompass["Track trueHeading compass to calculate bearing offset"]
        HeadingCompass --> AngleCheck{"Angle diff is within [-35, 35] horizontal FOV?"}

        AngleCheck -- Yes --> DrawBubble["Render high-contrast projected label bubble"]
        AngleCheck -- No --> CheckSingleTarget{"Is tracking single navigation target?"}

        CheckSingleTarget -- No --> HideBubble["Hide label bubble"]
        CheckSingleTarget -- Yes --> ClampBubble["Clamp bubble to screen edge"]
        ClampBubble --> RenderGuideArrows["Render offscreen guide arrows: « Left or Right »"]

        DrawBubble --> DepthScaling["Scale label down logarithmically based on GPS distance"]
    end
```

### Detailed Functional Walkthrough: Mobile Client

1.  **Strict Startup Lifecycle Synchronization**:
    *   `app/index.tsx` checks `navigationState?.key` to verify that the router is fully mounted before loading downstream UI dependencies, avoiding race conditions.
    *   Triggers parallel pre-fetching of events and search lists with a built-in **5-second** safety timeout to guarantee the app remains responsive even during server outages.
2.  **Dynamic Dual Canvas Dashboard (Explore vs Map)**:
    *   Coordinated inside `app/(main)/index.tsx` via a horizontally sliding drawer canvas managed by React Native Reanimated's `screenMode.value`.
    *   Tapping an event in the discovery feed automatically updates this variable, shifts focus to the map view, and centers the camera on the selected item.
3.  **Triple-Height Expansive Top Search Drawer (Search Island)**:
    *   A floating search bar panel that snaps across three height configurations depending on panning gestures (`Gesture.Pan`): collapsed (`0.0`), intermediate category pills (`0.5`), and full search query view (`1.0`).
    *   Implements an anti-skip swipe check to enforce natural transitions between states.
4.  **Concurrent Multi-Profile Route Planning**:
    *   When planning, the app queries driving, walking, and bicycling routes in parallel to display ETAs.
    *   Calculated paths are dynamically recalculated in real-time if accessibility preferences (such as avoiding steps) are toggled in the user profile sheet.
5.  **Augmented Reality (AR) Overlay Activation**:
    *   Device gyroscopes are polled at 60fps. If the screen's angular tilt is vertical (between 45° and 135°), the app locks the screen to portrait, activates the camera, and projects spatial location labels.

---

## Web-Admin Workflows

This diagram models the operational workflows of the **Lattice Administration Web Platform** (Web-Admin), charting access controls, perimetral polygon drawings, and live telemetry integrations.

```mermaid
flowchart TD
    %% 0. Access Control & Middleware
    InitialEntry(["Access App URL"]) --> CheckSessionCookie{"Has 'session' Cookie?"}
    CheckSessionCookie -- No --> GoToLogin["Redirect to /login"]
    CheckSessionCookie -- Yes --> GoToDashboard["Allow access to / (Command Center)"]

    %% 1. Admin Login (Secure Access)
    subgraph AdminAuth ["Admin Secure Authentication (/login)"]
        GoToLogin --> RenderLogin["Render Secure Access Form"]
        RenderLogin --> InputCredentials["Enter Operational Email & Security Key"]
        InputCredentials --> ClickAuthenticate["Click Authenticate Button"]

        ClickAuthenticate --> ServerAction["Invoke 'use server' login action"]
        ServerAction --> ValidateEnv{"Credentials match ADMIN_EMAIL & ADMIN_PASSWORD?"}

        ValidateEnv -- No --> ReturnError["Return 'Invalid email or password'"]
        ReturnError --> DisplayError["Render Warning Card: Invalid Credentials"]
        DisplayError --> RenderLogin

        ValidateEnv -- Yes --> EncryptSession["Encrypt session payload { email, expires }"]
        EncryptSession --> SetSessionCookie["Set 'session' Cookie (httpOnly, sameSite=lax, 24h expire)"]
        SetSessionCookie --> RedirectHome["redirect('/')"]
        RedirectHome --> GoToDashboard
    end

    %% 2. Command Center Launch
    GoToDashboard --> FetchAdminData["Pre-fetch useEvents & usePOIs Hooks"]
    FetchAdminData --> LoadingState{"Hook Loading State?"}

    LoadingState -- Yes --> ShowSplash["Display 'Loading Command Center...' Spinner"] --> LoadingState
    LoadingState -- No --> InitGlobalFit["Init One-Time Global Map bounds fit to events"]

    InitGlobalFit --> URLParamCheck{"URL query params present?"}
    URLParamCheck -- Yes (eventId) --> FocusEvent["Find event, set visible, center map and open details"]
    URLParamCheck -- Yes (poiId) --> FocusPOI["Find POI, enable parent event, center map (zoom 18) and select POI"]
    URLParamCheck -- No --> ActiveMapDisplay["Render base AdminMap + Sidebar components"]

    FocusEvent --> ActiveMapDisplay
    FocusPOI --> ActiveMapDisplay

    %% 3. Sidebar Search & Actions
    subgraph SidebarInteraction ["Sidebar & Map Control Center"]
        ActiveMapDisplay --> SidebarInputs{"Sidebar User Action"}

        SidebarInputs -- "Type in Search Input (?q=)" --> FilterSbarList["Filter event list in sidebar by name"]
        SidebarInputs -- "Search results equals 1 unique match?" --> CheckUniqueMatch{"Search results equals 1 unique match?"}
        CheckUniqueMatch -- Yes --> AutoSnapMap["Trigger Map Center Snap to selected event coordinates"]
        CheckUniqueMatch -- No --> KeepMapBounds["Maintain active map bounds"]

        SidebarInputs -- "Toggle Event Checkbox" --> SetVisibleEventIds["Modify visibleEventIds Set in page state"]
        SetVisibleEventIds --> RenderMarkers["Redraw corresponding Event & POI pins on AdminMap"]

        SidebarInputs -- "Solo Event (Double Click)" --> IsolateEvent["Set visibleEventIds strictly to isolated event"]
        IsolateEvent --> ZoomToBoundary["Fit Map boundary to isolated event Polygon"]

        ActiveMapDisplay --> TapMapMarker["Click Event/POI Pin on AdminMap"]
        TapMapMarker --> SetSelectedAsset["Set selectedAsset state & Open Slide-Out AssetPanel"]
    end

    %% 4. Telemetry & Crowd Radar Polling
    subgraph TelemetryRadar ["Real-Time Crowd Radar Telemetry"]
        SetSelectedAsset --> ToggleRadar["Click Toggle Radar button"]
        ToggleRadar --> ToggleRadarSet["Add/Remove Event ID from radarEventIds state"]

        ToggleRadarSet --> CheckRadarActive{"Is radarEventIds Set empty?"}
        CheckRadarActive -- Yes --> StopPolling["Clear telemetry interval & remove heatmap layer"]
        CheckRadarActive -- No --> StartPolling["Start interval timer (Runs every 5000ms)"]

        StartPolling --> PollTelemetryLoop["Interval Tick: Fetch locations?eventId=ID in parallel"]
        PollTelemetryLoop --> CollectCoords["Collect coordinates from geo/locations Endpoint"]
        CollectCoords --> FormatFeatureCollection["Aggregate coordinates into single GeoJSON FeatureCollection"]
        FormatFeatureCollection --> UpdateHeatmap["Send FeatureCollection to AdminMap source & redraw Heatmap Tiles"]
        UpdateHeatmap --> PollTelemetryLoop
    end

    %% 5. Event Operations Lifecycle
    subgraph EventLifecycle ["Event Lifecycle Manager (/events)"]
        ActiveMapDisplay -- "Navigate to /events" --> EventPageReady["Render Events Operations Table"]
        EventPageReady --> SelectEventFilters["Filter list by Status (active/past) & Scale (massive/boutique)"]

        EventPageReady --> ClickCreateOrEditEvent["Click Create or Edit Event Action"]
        ClickCreateOrEditEvent --> OpenStudioUI["Launch absolute Full-Screen Studio UI Overlay"]
        OpenStudioUI --> SetDrawBoundaryMode["Initialize AdminMap in DRAW_BOUNDARY mode"]

        SetDrawBoundaryMode --> InteractMapCanvas{"Click Map Canvas"}
        InteractMapCanvas -- "Add Coordinate Point" --> UpdateBoundaryPoints["Append coordinate to boundaryPoints array"]
        InteractMapCanvas -- "Click Undo button" --> UndoLastPoint["Pop last coordinate from boundaryPoints"]
        InteractMapCanvas -- "Click Clear button" --> ClearPoints["Reset boundaryPoints array to empty"]

        UpdateBoundaryPoints --> RenderPolyOverlay["Draw current Polygon boundary overlay live on map"]
        UndoLastPoint --> RenderPolyOverlay
        ClearPoints --> RenderPolyOverlay

        OpenStudioUI --> FillEventIdentity["Fill out Name, Venue Name, Dates & Banner/Gallery URLs in Studio Card"]
        FillEventIdentity --> ClickConfirmEvent["Click Confirm Event / Update Event"]

        ClickConfirmEvent --> ValidateEventForm{"Form identity & 3+ boundary points valid?"}
        ValidateEventForm -- No --> ShowFormError["Display operational validation error"]
        ValidateEventForm -- Yes --> SerializeGeoJSONPolygon["Append first coordinate to end to close the loop & format Polygon"]
        SerializeGeoJSONPolygon --> RequestSaveEvent["Send POST/PATCH to /api/events API"]
        RequestSaveEvent --> CloseStudioUI["Close Studio UI Overlay, refetch event list & refresh table"]
    end

    %% 6. Amenities & Point of Interest Registration
    subgraph POILifecycle ["Amenities & POIs Registry (/pois)"]
        ActiveMapDisplay -- "Navigate to /pois" --> POIPageReady["Render Amenities Table"]
        POIPageReady --> ConnectWebSocket["Initialize useSocket Hook & subscribe to admin:pois:updated"]

        ConnectWebSocket --> ListenSocketEvents["Listen for POIs update socket signals"]
        ListenSocketEvents -- "admin:pois:updated broadcast" --> SocketRefetch["Trigger non-blocking list refetch"]
        SocketRefetch --> UpdateOccupancyBars["Re-render live Occupancy Bar Graphs in table"]

        POIPageReady --> ClickCreateOrEditPOI["Click Create or Edit POI Action"]
        ClickCreateOrEditPOI --> OpenPOIStudioUI["Launch absolute Full-Screen Studio UI Overlay"]
        OpenPOIStudioUI --> SetPickCoordinateMode["Initialize AdminMap in PICK_COORDINATE mode"]

        SetPickCoordinateMode --> PlaceMarkerPin["Left-click map canvas to place location pin"]
        PlaceMarkerPin --> RequestReverseGeocoding["Send GET request to api/resolve-address?lat=Y&lng=X"]
        RequestReverseGeocoding --> ResolveAddress["Resolve street address & venue name from coordinates"]
        ResolveAddress --> AutoPopulateAddress["Auto-populate Address & Location Name inputs in form card"]

        OpenPOIStudioUI --> SelectPOICategory["Select Category Tile (Toilets, Restaurant, Bar, Medical)"]
        CompletePOIFields["Specify Capacity, Wheelchair/Priority access & Media URLs"] --> ClickConfirmPOI["Click Confirm Asset / Update Asset"]

        ClickConfirmPOI --> ValidatePOIForm{"Asset Name, Category & Location pin placed?"}
        ValidatePOIForm -- No --> ShowPOIError["Display validation error inside Studio"]
        ValidatePOIForm -- Yes --> RequestSavePOI["Send POST/PATCH to /api/pois API"]
        RequestSavePOI --> ClosePOIStudioUI["Close Studio, refetch registry list & refresh UI table"]
    end
```

### Detailed Functional Walkthrough: Web-Admin

1.  **Security Gates & Encrypted Cookies**:
    *   Admin routes are protected via Next.js middleware checking for an encrypted `session` cookie. If missing, users are redirected to `/login`.
    *   Form submissions leverage Next.js **Server Actions** running strictly on the server to validate credentials, generate a 24-hour encrypted session, set `httpOnly` secure cookies, and perform standard redirects.
2.  **Command Center Launch & Parameter Tracking**:
    *   Uses specialized hooks (`useEvents` / `usePOIs`) displaying a loading spinner until resolution. Fits geographical views based on loaded boundaries.
    *   Deep linking via query parameters (`eventId` or `poiId`) automatically filters parent events, focuses maps (zoom level 18), and slides out active metadata cards.
3.  **Real-Time Telemetry & Heatmap Polling**:
    *   Toggling telemetry on active events initializes background fetch calls executing **every 5 seconds**.
    *   Pulls coordinates from `/api/geo/locations`, compiles them into standard GeoJSON structures, and updates the MapLibre layer data source to redraw heatmap densities.
4.  **Drawing Coordinates & Polygons (`DRAW_BOUNDARY`)**:
    *   Creating events opens full-screen overlays supporting node-by-node polygon drawings on the canvas. Forms auto-append the initial coordinate to the final index to correctly close the GeoJSON boundary.
5.  **Reverse Geocoding & WebSocket Live Sync**:
    *   Placing markers in `PICK_COORDINATE` mode fires queries resolving Human-Readable addresses to auto-populate form inputs.
    *   Connects to Socket.io channels subscribing to `'admin:pois:updated'` broadcasts, triggering non-blocking visual table refreshes when staff mutate data.

<Callout type="info">
  **Real-Time Synchronization**: Toggling the active radar starts background telemetry workers in the mobile clients, routing high-frequency logging through dedicated telemetry API paths to ensure optimal mapping accuracy.
</Callout>
