#!/bin/bash

# Navigate to the correct directory
cd "$(dirname "$0")"

echo "Starting Learn Sphere Web App..."

# Start Vite dev server in the background
npm run dev &
VITE_PID=$!

echo "Vite server running with PID $VITE_PID"
echo "Waiting for Vite to start..."
sleep 3

echo "Starting Cloudflare tunnel..."
# Start cloudflared tunnel
cloudflared tunnel --url http://localhost:5173 &
TUNNEL_PID=$!

echo "Cloudflare tunnel running with PID $TUNNEL_PID"

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $VITE_PID 2>/dev/null
    kill $TUNNEL_PID 2>/dev/null
    echo "Shutdown complete."
    exit 0
}

# Catch termination signals to run cleanup
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $VITE_PID $TUNNEL_PID
