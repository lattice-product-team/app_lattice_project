#!/bin/bash
# Sync docs from root to pages
mkdir -p src/pages
# Clean up previous sync
find src/pages -mindepth 1 -maxdepth 1 -not -name "_app.tsx" -not -name "_document.tsx" -exec rm -rf {} +

# Copy everything
cp -r ../../docs/* src/pages/

# Rename README.md to index.mdx for clean routing
find src/pages -name "README.md" -exec bash -c 'mv "$1" "${1%README.md}index.mdx"' _ {} \;
find src/pages -name "*.md" -exec bash -c 'mv "$1" "${1%.md}.mdx"' _ {} \;

# Remove non-page files that Next.js might try to compile as routes
find src/pages -name "*.html" -type f -delete
find src/pages -name "*.py" -type f -delete
find src/pages -name "*.sh" -type f -delete
find src/pages -name "*.ts" -type f -delete
find src/pages -name "*.tsx" -type f -delete
find src/pages -name "*.js" -type f -delete
