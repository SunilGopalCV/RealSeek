#!/bin/bash
# RealSeek Backend Startup Script
# Automatically configures environment variables and starts the Neuro SAN REST API server.

# Get the absolute directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define virtual environment python path
PYTHON_BIN="$SCRIPT_DIR/venv/bin/python"

if [ ! -f "$PYTHON_BIN" ]; then
    echo "❌ Error: Virtual environment python not found at:"
    echo "   $PYTHON_BIN"
    exit 1
fi

# Clean up any process on port 8080 to avoid "port is already in use" prompts
if lsof -t -i:8080 >/dev/null; then
    echo "⚠️ Port 8080 is already in use. Stopping existing process..."
    kill -9 $(lsof -t -i:8080) 2>/dev/null
    sleep 1.5
fi

# Enable CORS headers for web applications
export AGENT_ALLOW_CORS_HEADERS=1
echo "✅ CORS headers enabled (AGENT_ALLOW_CORS_HEADERS=1)"

echo "🚀 Starting RealSeek Backend (Neuro SAN REST Server)..."
echo "Python version: $("$PYTHON_BIN" --version)"
echo ""

# Configure PYTHONPATH and AGENT_TOOL_PATH and start server
cd "$SCRIPT_DIR/backend"
export AGENT_TOOL_PATH="$SCRIPT_DIR/"
export PYTHONPATH="$SCRIPT_DIR/"

exec "$PYTHON_BIN" run_server.py run --server-only
