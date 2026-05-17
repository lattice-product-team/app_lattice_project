#!/bin/bash

# Target directory
PAGES_DIR="pages"
mkdir -p "$PAGES_DIR"

# Clean up previous sync (preserve essential Next.js files)
find "$PAGES_DIR" -mindepth 1 -maxdepth 1 -not -name "_app.tsx" -not -name "_document.tsx" -not -name "globals.css" -exec rm -rf {} +

# Since the root /docs already follows the professional structure:
cp -r ../../docs/* "$PAGES_DIR/"
rm -rf "$PAGES_DIR/product"

# Use the root README.md as the main landing page
cp ../../README.md "$PAGES_DIR/index.md"

# --- Normalization ---

# Determine OS-specific sed in-place parameter
if [ "$(uname)" = "Darwin" ]; then
  SED_I=(sed -i '')
else
  SED_I=(sed -i)
fi

# 1. Convert GitHub alerts to Nextra Callouts
find "$PAGES_DIR" -name "*.md" -exec "${SED_I[@]}" 's/> \[!IMPORTANT\]/<Callout type="error">/g' {} +
find "$PAGES_DIR" -name "*.md" -exec "${SED_I[@]}" 's/> \[!WARNING\]/<Callout type="warning">/g' {} +
find "$PAGES_DIR" -name "*.md" -exec "${SED_I[@]}" 's/> \[!NOTE\]/<Callout type="info">/g' {} +
find "$PAGES_DIR" -name "*.md" -exec "${SED_I[@]}" 's/> \[!TIP\]/<Callout type="info">/g' {} +

# 2. Add Callout import if needed
find "$PAGES_DIR" -name "*.md" -exec bash -c '
  if [ "$(uname)" = "Darwin" ]; then
    SED_I=(sed -i "")
  else
    SED_I=(sed -i)
  fi
  if grep -q "<Callout" "$1"; then
    "${SED_I[@]}" "1i\
import { Callout } from \"nextra/components\"\
" "$1"
  fi' _ {} \;

# 3. Remove common emojis
find "$PAGES_DIR" -name "*.md" -exec "${SED_I[@]}" 's/🚀//g' {} +
find "$PAGES_DIR" -name "*.md" -exec "${SED_I[@]}" 's/🌐//g' {} +
find "$PAGES_DIR" -name "*.md" -exec "${SED_I[@]}" 's/📦//g' {} +

# 4. Convert all .md to .mdx
find "$PAGES_DIR" -name "*.md" -exec bash -c 'mv "$1" "${1%.md}.mdx"' _ {} \;

# 5. Security Cleanup: Remove non-documentation files (but preserve _meta and Next.js essentials)
find "$PAGES_DIR" -type f \( -name "*.html" -o -name "*.py" -o -name "*.sh" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) ! -name "_meta.*" ! -name "_app.*" ! -name "_document.*" -delete

echo "🚀 Documentation synced successfully from the professionalized source!"
