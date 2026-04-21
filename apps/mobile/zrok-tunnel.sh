#!/bin/bash

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_PORT=3000
METRO_PORT=8081
ENV_FILE="$SCRIPT_DIR/.env"

echo "🚀 Starting zrok tunnels for Lattice Mobile from $SCRIPT_DIR..."

# Check if zrok is installed
if ! command -v zrok &> /dev/null; then
    echo "❌ zrok is not installed. Please install it from https://zrok.io"
    exit 1
fi

# Function to stop tunnels on exit
cleanup() {
    echo "🛑 Stopping tunnels..."
    # Kill background jobs
    kill $(jobs -p) 2>/dev/null
    # Specifically target any remaining zrok shares
    pkill -f "zrok share public" 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM EXIT

# Clean up any existing leaked zrok processes before starting
pkill -f "zrok share public" 2>/dev/null

# Function to wait for a zrok URL in a log file
wait_for_url() {
    local log_file=$1
    local name=$2
    local max_attempts=20
    local attempt=1
    local url=""

    echo "⏳ Waiting for $name URL to appear in $log_file..." >&2
    while [ $attempt -le $max_attempts ]; do
        # Only grep for valid-looking random character URLs, avoid generic "error" strings
        url=$(grep -oE "https://[a-zA-Z0-9]{12}\.share\.zrok\.io" "$log_file" | head -n 1)
        if [ -n "$url" ]; then
            echo "$url"
            return 0
        fi
        
        # Check if zrok process is still running
        if ! pgrep -f "zrok share public" > /dev/null; then
            # Check for explicit errors in log
            local err_msg=$(grep -i "error" "$log_file" | tail -n 1)
            echo "❌ zrok process for $name died. Error: $err_msg" >&2
            return 1
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
    echo "❌ Timeout waiting for $name URL in $log_file" >&2
    return 1
}

# Start Metro tunnel
echo "📡 Starting Metro tunnel on port $METRO_PORT..."
# Remove old log if exists
rm -f "$SCRIPT_DIR/metro_zrok.log"
zrok share public http://localhost:$METRO_PORT --headless > "$SCRIPT_DIR/metro_zrok.log" 2>&1 &
METRO_URL=$(wait_for_url "$SCRIPT_DIR/metro_zrok.log" "Metro")

if [ $? -ne 0 ]; then
    cleanup
fi

if [ -z "$METRO_URL" ]; then
    echo "❌ Failed to retrieve Metro tunnel URL. Aborting."
    cleanup
fi

# Run Metro Bundler with proxy settings
echo "📦 Starting Metro Bundler..."
# Change to the mobile app directory
cd "$SCRIPT_DIR" || exit 1
export EXPO_PACKAGER_PROXY_URL="$METRO_URL"

# Start expo
echo "📲 Starting Expo (scan the QR code if it's not detected automatically)..."
npx expo start --clear
