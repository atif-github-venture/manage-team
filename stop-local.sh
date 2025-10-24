#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping Team Management App...${NC}\n"

# Stop backend
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend stopped (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${YELLOW}Backend not running${NC}"
    fi
    rm backend.pid
else
    echo -e "${YELLOW}No backend PID file found${NC}"
fi

# Stop frontend
if [ -f frontend.pid ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend stopped (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${YELLOW}Frontend not running${NC}"
    fi
    rm frontend.pid
else
    echo -e "${YELLOW}No frontend PID file found${NC}"
fi

# Kill any remaining node processes on ports 3000 and 5000
echo -e "\n${YELLOW}Cleaning up ports...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Freed port 3000${NC}"
lsof -ti:5000 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Freed port 5000${NC}"

echo -e "\n${GREEN}Application stopped${NC}"