@echo off
REM NEXORA Development Server Startup Script

echo ========================================
echo   NEXORA Development Servers
echo ========================================

REM Kill any existing node processes
echo.
echo Clearing existing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Seed the database
echo.
echo Seeding database...
cd /d C:\Users\salah\NEXORA\server
call npm run seed >nul 2>&1

REM Start backend server
echo.
echo Starting backend server (port 4000)...
start "NEXORA Backend" node "C:\Users\salah\NEXORA\server\src\app.js"
timeout /t 2 /nobreak >nul

REM Start frontend server
echo Starting frontend server (port 3000)...
cd /d C:\Users\salah\NEXORA\frontend-server
start "NEXORA Frontend" npm start

echo.
echo ========================================
echo   Servers started successfully!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:4000
echo.
echo Close these windows to stop the servers.
echo ========================================
