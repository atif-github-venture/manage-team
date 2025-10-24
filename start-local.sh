#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Team Management App - Local Setup${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Check if .env exists in backend
if [ ! -f backend/.env ]; then
    echo -e "${RED}Error: backend/.env file not found!${NC}"
    echo -e "${YELLOW}Please create backend/.env file with required variables${NC}"
    exit 1
fi

# Check if .env exists in frontend
if [ ! -f frontend/.env ]; then
    echo -e "${RED}Error: frontend/.env file not found!${NC}"
    echo -e "${YELLOW}Please create frontend/.env file with required variables${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}Backend dependencies already installed${NC}"
fi
cd ..

# Install frontend dependencies
echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}Frontend dependencies already installed${NC}"
fi
cd ..

# Create logs directory
mkdir -p logs

# Check if MongoDB is accessible
echo -e "\n${YELLOW}Checking MongoDB connection...${NC}"
if ! nc -z localhost 27017 2>/dev/null; then
    echo -e "${RED}Warning: Cannot connect to MongoDB at localhost:27017${NC}"
    echo -e "${YELLOW}Make sure MongoDB is running${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Start backend
echo -e "\n${YELLOW}Starting backend server...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}Backend failed to start!${NC}"
    echo -e "${YELLOW}Check logs/backend.log for details${NC}"
    exit 1
fi

# Start frontend
echo -e "${YELLOW}Starting frontend server...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
cd ..

# Wait for frontend to start
sleep 3

# Check if frontend is running
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${RED}Frontend failed to start!${NC}"
    echo -e "${YELLOW}Check logs/frontend.log for details${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Application is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend:  http://localhost:5000${NC}"
echo -e "${GREEN}Health:   http://localhost:5000/health${NC}"
echo -e "\n${YELLOW}Backend PID:  $BACKEND_PID${NC}"
echo -e "${YELLOW}Frontend PID: $FRONTEND_PID${NC}"
echo -e "\n${YELLOW}View backend logs:${NC}  tail -f logs/backend.log"
echo -e "${YELLOW}View frontend logs:${NC} tail -f logs/frontend.log"
echo -e "\n${YELLOW}To stop:${NC} ./stop-local.sh"