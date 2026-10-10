#!/bin/bash

# Navigate to script directory
cd "$(dirname "$0")"

echo "=========================================================="
echo "   LEARNSPHERE - LOCAL DEV SERVER (NO CLOUDFLARE)         "
echo "=========================================================="
echo ""
echo "Starting local Vite development server..."
echo "Access URLs:"
echo " - Local:   http://localhost:5173"
echo " - Network: Available on your local Wi-Fi / IP"
echo ""
echo "Press [Ctrl + C] anytime to stop the server."
echo "=========================================================="
echo ""

# Run Vite directly with host flag for local & mobile LAN testing
npm run dev -- --host
