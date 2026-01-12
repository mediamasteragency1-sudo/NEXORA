@echo off
REM NEXORA Development Server Launcher for Windows

echo.
echo 🚀 Starting NEXORA Application Servers...
echo.

REM Kill any existing node processes
echo 🧹 Cleaning up old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Start backend API server
echo 📡 Starting Backend API Server (port 4000)...
start "NEXORA Backend" cmd /k "cd /d "%~dp0" && node src/app.js"
timeout /t 2 >nul

REM Start frontend server
echo 🎨 Starting Frontend Server (port 3000)...
start "NEXORA Frontend" cmd /k "cd /d "%~dp0" && node serve-frontend.js"
timeout /t 1 >nul

echo.
echo ✅ NEXORA Servers Started Successfully!
echo.
echo 📝 Access Points:
echo    • Frontend: http://localhost:3000
echo    • API:      http://localhost:4000
echo    • Home:     http://localhost:3000/index.html
echo    • Catalog:  http://localhost:3000/catalog.html
echo.
echo 💡 Close the terminal windows to stop the servers
echo.
pause
