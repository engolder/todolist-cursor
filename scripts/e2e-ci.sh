#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting E2E Test CI Script...${NC}"

# Clean up function
cleanup() {
    echo -e "${YELLOW}Cleaning up background processes...${NC}"
    # Kill backend services
    pkill -f "go run cmd/task-service/main.go" 2>/dev/null || true
    # Kill frontend dev server (if started by this script)
    if [[ -n "$FRONTEND_PID" ]]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start backend services
echo -e "${GREEN}Starting backend services...${NC}"
make dev-backend &
BACKEND_PID=$!

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo -e "${GREEN}Backend is ready!${NC}"
        break
    fi
    if [[ $i -eq 30 ]]; then
        echo -e "${RED}Backend failed to start within 30 seconds${NC}"
        exit 1
    fi
    sleep 1
done

# Change to frontend directory and run E2E tests
echo -e "${GREEN}Running E2E tests...${NC}"
cd frontend

# Install playwright browsers if not already installed
npx playwright install --with-deps chromium

# Run the tests
yarn test:e2e

echo -e "${GREEN}E2E tests completed successfully!${NC}"