@echo off
setlocal enabledelayedexpansion

color 0B
cls

echo.
echo ╔════════════════════════════════════════════════╗
echo ║     NEXORA E-Commerce Platform - Startup      ║
echo ╚════════════════════════════════════════════════╝
echo.

echo [1/3] Killing any existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend API ^(localhost:4000^)...
cd server
start cmd /k "node server.js"
timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend Server ^(localhost:3000^)...
cd ..\frontend-server
start cmd /k "node server.js"
timeout /t 2 /nobreak >nul

cd ..

echo.
echo ✓ All servers started!
echo.
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:4000
echo    Admin:     http://localhost:3000/admin/
echo.
echo    Admin credentials: admin / admin
echo.
echo Press any key to close this window...
pause >nul
