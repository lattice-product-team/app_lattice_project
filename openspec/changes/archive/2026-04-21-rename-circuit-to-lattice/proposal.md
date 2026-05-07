# Proposal: Rename "Circuit" to "Lattice"

## Problem

The project branding is inconsistent, with various references to "Circuit Copilot", "circuit_db", and "race" across the codebase (UI, database, configuration, and documentation).

## Goal

Unify the project identity by renaming all relevant occurrences of "circuit" and "race" to "**Lattice**".

## Scope

- Update database name and connection strings.
- Update UI text and labels in the mobile app.
- Update configuration files (e.g., `app.json`).
- Update documentation and scripts.

## Non-goals

- Renaming external dependencies (e.g., in `package-lock.json` or `node_modules`).
- Changing the names of folders in `apps/` or `packages/` (unless strictly necessary).

## Success Criteria

- The application identity is consistently "Lattice".
- No "circuit" or "race" references remain in the primary user-facing UI or core infrastructure.
- The project builds and runs successfully after the changes.
