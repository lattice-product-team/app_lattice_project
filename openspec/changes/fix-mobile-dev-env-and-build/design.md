## Context

The current development flow relies on manual IP injection into `.env` files. This is brittle because:
1.  `app.json` has `output: static`, causing Metro to attempt SSR on native-only libraries (MapLibre, MMKV), leading to `Object prototype` errors.
2.  `docker-compose` and Metro must listen on all interfaces to be reachable by physical devices.
3.  Developers lack a clear diagnostic tool to tell them WHY their phone isn't connecting (Firewall vs. Network Isolation).

## Goals / Non-Goals

**Goals:**
- Eliminate bundling crashes by fixing Expo's output configuration.
- Automate IP detection specifically for macOS Hotspot scenarios.
- Provide a clear diagnostic error message when the laptop is unreachable.
- Unify the `dev:lan` command into a single, idempotent process.

**Non-Goals:**
- Replacing Docker for backend development.
- Implementing a production-grade CI/CD pipeline (out of scope for this env fix).

## Decisions

### 1. Disable Static Rendering in `app.json`
- **Choice**: Change `web.output` from `static` to `single` (or remove it).
- **Rationale**: Static output triggers a "node render" phase in Metro. Native modules like MapLibre and MMKV don't have Node fallbacks and return `undefined`, causing the bundling process to crash. A SPA-style "single" output is sufficient for development.

### 2. Intelligent Interface Discovery
- **Choice**: Use a script that prioritizes `bridge100` (Hotspot) and `en0` (WiFi) over other interfaces.
- **Rationale**: Generic `ifconfig` grep often picks the wrong interface (like Ethernet or VPN), sending the wrong IP to the phone.

### 3. Integrated Pre-flight Diagnostics
- **Choice**: Add a `predev` check that tries to open a temporary socket on port 8081 and 3000 on the external IP.
- **Rationale**: Provides immediate feedback if the macOS Firewall is blocking incoming connections, saving hours of debugging.

## Risks / Trade-offs

- **[Risk]** Tunnel conflict → **Mitigation**: Ensure only one tunnel provider is used at a time and detect running instances of Ngrok/Zrok.
- **[Risk]** Hotspot Isolation → **Mitigation**: The diagnostic tool will explicitly warn the user to toggle their hotspot if the IP is found but unreachable.
