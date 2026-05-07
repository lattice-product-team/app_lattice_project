## Context

Moving to a light theme inspired by Apple Maps requires a fundamental shift in how we handle depth and color. In dark mode, light creates depth; in light mode, shadows and borders create depth.

## Goals / Non-Goals

**Goals:**

- Implement a "Solar Gold" centered light theme.
- Create a floating UI system with `BlurView` support.
- Establish a semantic color mapping for event categories.

**Non-Goals:**

- Creating a full dark mode alternative in this first phase (focus is 100% on light).
- Changing the underlying MapLibre/React Native architecture.

## Decisions

### 1. Solar Gold Hierarchy

We will replace the "Wine" palette with a hierarchy of Yellow/Gold tones:

- **Primary (`#EFB33F`)**: Hero actions, routing, selected states.
- **Surface High (`#FFFFFF`)**: Main cards, search bars.
- **Background (`#F9F9FB`)**: Map-adjacent UI backgrounds.
- **Text (`#1C1B1C`)**: High contrast typography.

### 2. Apple-Style Component Pattern

- **Cards**: All bottom sheets and modals will use a corner radius of `24px` and a background of `rgba(255, 255, 255, 0.7)` with a high `blurAmount`.
- **Floating Search**: The search bar will be a floating pill with a soft `shadowRadius: 10`.

### 3. Semantic POI Palette (Map)

We will use vibrant, Apple-like colors for different event categories:

- **Stages/Music**: `#AF52DE` (Purple)
- **Food/Drinks**: `#FF9500` (Orange)
- **Services/Info**: `#007AFF` (Blue)
- **Emergency**: `#FF3B30` (Red)
- **Selected**: `#EFB33F` (Solar Gold)

### 4. Iconography

- **Library**: Lucide React Native (consistent stroke width).
- **Style**: Icons enclosed in colored circles with a slight white border for separation over the map.

## Risks / Trade-offs

- **[Risk] Sunlight Visibility** → **Mitigation**: Use high-contrast text (`#000`) over the yellow accents. Avoid light gray text on white backgrounds.
- **[Risk] Performance with Blur** → **Mitigation**: Use `expo-blur` which is hardware accelerated on iOS.
- **[Risk] Map Legibility** → **Mitigation**: Transition to CartoDB Positron style which has high contrast for vector data.
