# Proposal: Lattice Event Platform Transition

## Problem

Currently, Lattice is hardcoded for a single venue (Circuit de Barcelona-Catalunya). This restricts its growth and requires manual code changes to support other locations.

## Goal

Transform Lattice into a general-purpose Event Platform (SaaS). This involves:

- Moving to a multitenant database architecture.
- Creating an Admin Web Dashboard to manage venues, events, and POIs.
- Making the mobile app dynamic, fetching its configuration based on the user's event ticket.

## Scope

- Backend: Refactor schema to include `venues` and `events`.
- Admin Web: Develop a new React-based application for event management and real-time analytics (Heatmaps).
- Mobile App: Update UI and services to be data-driven, supporting multiple event configurations.

## Non-goals

- Changing the core AR navigation logic.
- Building a full CRM or payment gateway (focus on event management and logistics).

## Success Criteria

- An administrator can create a new venue and event via the web dashboard.
- The mobile app displays the correct event branding and map after a user scans their ticket.
- Real-time telemetry (Crowd Radar) can be visualized on the admin dashboard.
