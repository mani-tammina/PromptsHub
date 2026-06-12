@echo off
REM Prompt Hub - Startup Script for Windows
REM This script starts a local HTTP server to run Prompt Hub

echo.
echo ========================================
echo Prompt Hub - Enterprise Prompt Library
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting local server with Python...
    echo.
    echo Opening: http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    timeout /t 2 >nul
    start http://localhost:8000
    python -m http.server 8000
) else (
    echo Python not found. Trying alternative methods...
    echo.
    
    REM Try Node.js
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Starting local server with Node.js...
        echo.
        echo Opening: http://localhost:8080
        echo.
        echo Press Ctrl+C to stop the server
        echo.
        timeout /t 2 >nul
        start http://localhost:8080
        npx http-server
    ) else (
        echo Neither Python nor Node.js found.
        echo.
        echo Please install one of the following:
        echo   1. Python: https://www.python.org/downloads/
        echo   2. Node.js: https://nodejs.org/
        echo.
        echo After installation, run this script again.
        echo.
        pause
    )
)
