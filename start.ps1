#!/bin/bash
# Script de démarrage NEXORA

echo "╔════════════════════════════════════════════════╗"
echo "║     NEXORA E-Commerce Platform - Startup      ║"
echo "╚════════════════════════════════════════════════╝"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${YELLOW}[1/3]${NC} Killing any existing Node processes..."
taskkill /F /IM node.exe 2>/dev/null || true
sleep 2

echo -e "${YELLOW}[2/3]${NC} Starting Backend API (localhost:4000)..."
cd server
Start-Process node -ArgumentList "server.js" -NoNewWindow
sleep 2

echo -e "${YELLOW}[3/3]${NC} Starting Frontend Server (localhost:3000)..."
cd ../frontend-server
Start-Process node -ArgumentList "server.js" -NoNewWindow
sleep 2

echo ""
echo -e "${GREEN}✓ All servers started!${NC}"
echo ""
echo "    Frontend:  http://localhost:3000"
echo "    Backend:   http://localhost:4000"
echo "    Admin:     http://localhost:3000/admin/"
echo ""
echo "    Admin credentials: admin / admin"
echo ""
echo "Logs are shown in separate windows."
