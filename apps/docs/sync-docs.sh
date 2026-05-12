#!/bin/bash

# Target directory
PAGES_DIR="src/pages"
mkdir -p "$PAGES_DIR"

# Clean up previous sync
find "$PAGES_DIR" -mindepth 1 -maxdepth 1 -not -name "_app.tsx" -not -name "_document.tsx" -exec rm -rf {} +

# Since the root /docs already follows the professional structure:
cp -r ../../docs/* "$PAGES_DIR/"

# --- Normalization ---


# 2. Convert all .md to .mdx
find "$PAGES_DIR" -name "*.md" -exec bash -c 'mv "$1" "${1%.md}.mdx"' _ {} \;

# 3. Security Cleanup: Remove non-documentation files (but preserve _meta config)
find "$PAGES_DIR" -type f \( -name "*.html" -o -name "*.py" -o -name "*.sh" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) ! -name "_meta.*" -delete

echo "🚀 Documentation synced successfully from the professionalized source!"
