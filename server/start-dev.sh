#!/bin/bash
# NEXORA Development Server Launcher

echo "🚀 Starting NEXORA Application Servers..."
echo ""

# Kill any existing node processes
echo "🧹 Cleaning up old processes..."
pkill -f "node" 2>/dev/null || true
sleep 2

# Start backend API server
echo "📡 Starting Backend API Server (port 4000)..."
cd "$(dirname "$0")"
node src/app.js &
BACKEND_PID=$!
sleep 2

# Start frontend server
echo "🎨 Starting Frontend Server (port 3000)..."
node serve-frontend.js &
FRONTEND_PID=$!
sleep 1

echo ""
echo "✅ NEXORA Servers Started Successfully!"
echo ""
echo "📝 Access Points:"
echo "   • Frontend: http://localhost:3000"
echo "   • API:      http://localhost:4000"
echo "   • Home:     http://localhost:3000/index.html"
echo "   • Catalog:  http://localhost:3000/catalog.html"
echo ""
echo "💡 Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
