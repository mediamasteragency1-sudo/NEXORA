#!/usr/bin/env pwsh
# NEXORA Development Server Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NEXORA Development Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing node processes
Write-Host "Clearing existing Node processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>&1 | Out-Null
Start-Sleep -Seconds 2

# Seed the database
Write-Host "Seeding database..." -ForegroundColor Yellow
Push-Location "C:\Users\salah\NEXORA\server"
npm run seed 2>&1 | Select-Object -Last 1
Pop-Location

# Start backend server
Write-Host ""
Write-Host "Starting backend server (port 4000)..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "C:\Users\salah\NEXORA\server\src\app.js" -WindowStyle Normal -PassThru | Out-Null
Start-Sleep -Seconds 2

# Start frontend server
Write-Host "Starting frontend server (port 3000)..." -ForegroundColor Green
Push-Location "C:\Users\salah\NEXORA\frontend-server"
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Normal -PassThru | Out-Null
Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers started successfully!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend:  http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:   http://localhost:4000" -ForegroundColor Green
Write-Host ""
Write-Host "Close the server windows to stop them." -ForegroundColor Yellow
Write-Host "========================================"
