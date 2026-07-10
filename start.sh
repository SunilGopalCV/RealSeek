#!/bin/bash
# RealSeek Startup Orchestrator
# Runs both backend and frontend concurrently in a single terminal.

# Get absolute path of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to clean up background processes
cleanup() {
    echo -e "\n${RED}Stopping all servers...${NC}"
    # Reset trap to prevent recursion/looping
    trap - EXIT SIGINT SIGTERM
    # Send SIGTERM to the entire process group
    kill -TERM 0 2>/dev/null
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}      RealSeek - Starting Application         ${NC}"
echo -e "${GREEN}==============================================${NC}"

# Start Backend
echo -e "${CYAN}Starting Backend...${NC}"
"$SCRIPT_DIR/start_backend.sh" &
BACKEND_PID=$!

# Wait a moment to let the backend initialize
sleep 2

# Start Frontend
echo -e "${BLUE}Starting Frontend...${NC}"
"$SCRIPT_DIR/start_frontend.sh" &
FRONTEND_PID=$!

echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}Both servers are running!${NC}"
echo -e "Backend:  http://localhost:8080"
echo -e "Frontend: http://localhost:5173"
echo -e "Press ${RED}Ctrl+C${NC} to stop both servers."
echo -e "${GREEN}==============================================${NC}"

# Wait for background processes to finish
wait
