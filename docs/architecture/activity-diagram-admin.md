# Web-Admin Activity Diagram

This diagram comprehensively describes the operational workflows of the **Lattice Administration Web Platform (Web-Admin)**. It graphically represents the initialization of the global command center dashboard, search filtration behavior, real-time map synchronization via WebSockets, real-time location telemetry processing (Crowd Radar), and the geographical creation/edition lifecycle of events and points of interest (POIs) extracted directly from the Next.js codebase.

## Web-Admin Workflows

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
        FilterSbarList --> CheckUniqueMatch{"Search results equals 1 unique match?"}
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
        SelectPOICategory --> CompletePOIFields["Specify Capacity, Wheelchair/Priority access & Media URLs"]
        
        CompletePOIFields --> ClickConfirmPOI["Click Confirm Asset / Update Asset"]
        ClickConfirmPOI --> ValidatePOIForm{"Asset Name, Category & Location pin placed?"}
        ValidatePOIForm -- No --> ShowPOIError["Display validation error inside Studio"]
        ValidatePOIForm -- Yes --> RequestSavePOI["Send POST/PATCH to /api/pois API"]
        RequestSavePOI --> ClosePOIStudioUI["Close Studio, refetch registry list & refresh UI table"]
    end
```

## Functional Breakdown of Web-Admin Workflows

1.  **Security and Administrative Access (Access Control & `/login`)**:
    *   **Middleware Gatekeeper**: The system utilizes a Next.js middleware check; if no active encrypted session cookie (`session`) is detected, the user is instantly redirected to the secure login page (`/login`).
    *   **Secure Server Actions**: The credential form leverages React's `useActionState` hook bound to the `'use server'` function `login`. This function executes exclusively on the server side to validate the operational email and security key against the secret backend variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
    *   **Session Encryption & Cookies**: Upon successful validation, the server encrypts the user email and expiration timestamp (set to **24 hours**), writes the encrypted cookie (`session`) with high-security parameters (`httpOnly`, `sameSite=lax`), and redirects the administrator to the main command center `/`.

2.  **Global Command Center (Command Center - `/`)**:
    *   **Coordinated Loading**: The `useEvents()` and `usePOIs()` hooks efficiently manage synchronous data loading, displaying a global center spinner page until data is successfully integrated.
    *   **URL Parameter Synchronization**: Opening the portal with `poiId` or `eventId` query parameters initiates automatic focusing: makes the parent event visible, zooms the camera to level 18, and renders the metadata slide-out panel in the sidebar drawer.

3.  **Search Filtration & Solo Mode Isolation**:
    *   **Unique Match Snap**: While filtering the event list in the sidebar, if the query matches exactly 1 unique event, the map camera automatically snaps to focus on that event.
    *   **Solo Mode Zooming**: Double-clicking an event isolates its bounds, hiding all other event layers and calling `fitBounds` to seamlessly frame the geographical perimeter of the selected event's polygon.

4.  **Real-Time Crowd Radar Telemetry Polling**:
    *   **Dynamic Intervals**: Toggling the radar on active events initializes a background fetch routine executing **every 5 seconds**.
    *   **Aggregated Density Heatmaps**: Collects live GPS coordinates from the `/api/geo/locations?eventId=ID` endpoint, parses them into a unified GeoJSON `FeatureCollection`, and passes it directly to the Mapbox/MapLibre source to render real-time Heatmap Tiles.

5.  **Event Perimeter Creation & Lifecycle**:
    *   **Interactive Drawing Overlay (`DRAW_BOUNDARY`)**: Creating an event launches a full-screen map overlay allowing point-by-point path definition. Floating tool buttons offer `Undo` and `Clear` state operations.
    *   **Polygon Ring Closing**: Upon form confirmation, the client automatically clones the initial coordinate pair and appends it to the end of the array, successfully serializing a closed ring `Polygon` structure required by spatial PostGIS APIs.

6.  **Amenity Registration & reverse-geocoding (`/pois`)**:
    *   **Reverse Geocoding Coordinates**: Placing custom pins in `PICK_COORDINATE` mode fires a fetch query to `/api/resolve-address?lat=Y&lng=X` to resolve human-readable postal addresses and venue titles, auto-populating the UI inputs.
    *   **WebSocket Multi-Client Sync**: Subscribes the browser client to the `'admin:pois:updated'` topic using WebSockets. When occupancy changes are made elsewhere, it triggers a non-blocking list refresh, maintaining real-time occupancy bar graphs.
