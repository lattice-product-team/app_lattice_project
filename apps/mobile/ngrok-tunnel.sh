#!/bin/bash

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATEWAY_PORT=3000

echo "🚀 Starting ngrok tunnel for Lattice API from $SCRIPT_DIR..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Please install it from https://ngrok.com"
    exit 1
fi

# Function to stop tunnels on exit
cleanup() {
    echo "🛑 Stopping tunnels..."
    # Kill background jobs
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM EXIT

# Start ngrok tunnel for Gateway
echo "📡 Starting ngrok tunnel on port $GATEWAY_PORT..."
# We use the ngrok agent to start a http tunnel and output to a temporary log to extract the URL
rm -f "$SCRIPT_DIR/ngrok.log"
ngrok http $GATEWAY_PORT --log=stdout > "$SCRIPT_DIR/ngrok.log" 2>&1 &

# Wait for URL
echo "⏳ Waiting for ngrok URL..."
sleep 3
NGROK_URL=$(grep -oE "https://[a-zA-Z0-9.-]+\.ngrok-free\.app" "$SCRIPT_DIR/ngrok.log" | head -n 1)

if [ -z "$NGROK_URL" ]; then
    # Try another pattern just in case
    NGROK_URL=$(grep -oE "https://[a-zA-Z0-9.-]+\.ngrok\.io" "$SCRIPT_DIR/ngrok.log" | head -n 1)
fi

if [ -n "$NGROK_URL" ]; then
    echo "✅ API Tunnel Ready: $NGROK_URL"
    export EXPO_PUBLIC_API_URL="$NGROK_URL/api/v1"
    export EXPO_PUBLIC_GATEWAY_HOST=$(echo $NGROK_URL | sed 's/https:\/\///')
    export EXPO_PUBLIC_GATEWAY_PORT=443
else
    echo "⚠️  Could not extract ngrok URL automatically."
    echo "   Please make sure ngrok is running and copy the URL manually if needed."
fi

# Start expo with its own tunnel for Metro
echo "📦 Starting Metro Bundler with Expo Tunnel..."
cd "$SCRIPT_DIR" || exit 1
npx expo start --tunnel
