#!/bin/bash
# Sync docs from root to app
mkdir -p src/app
cp -r ../../docs/* src/app/
# Ensure layout.tsx and other system files are not overwritten if they exist in root docs (unlikely)
# But layout.tsx should be in src/app/ already.
