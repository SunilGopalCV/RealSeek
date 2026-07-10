#!/bin/bash
# RealSeek Frontend Startup Script
# Configures a lightweight Python web server on port 5173. Zero Node.js dependencies!

# Get the absolute directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Clean up any process on port 5173 to avoid port collisions
if lsof -t -i:5173 >/dev/null; then
    echo "⚠️ Port 5173 is already in use. Stopping existing process..."
    kill -9 $(lsof -t -i:5173) 2>/dev/null
    sleep 1
fi

echo "🚀 Starting RealSeek Lightweight Frontend via Python..."
echo "Python version: $(python3 --version)"
echo "Frontend Directory: $SCRIPT_DIR/frontend"
echo ""

# Change to the frontend directory and start the python server
cd "$SCRIPT_DIR/frontend"
exec python3 -m http.server 5173
