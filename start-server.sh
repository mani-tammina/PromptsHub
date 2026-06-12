#!/bin/bash

# Prompt Hub - Startup Script for macOS/Linux
# This script starts a local HTTP server to run Prompt Hub

echo ""
echo "========================================"
echo "Prompt Hub - Enterprise Prompt Library"
echo "========================================"
echo ""

# Check if Python 3 is installed
if command -v python3 &> /dev/null; then
    echo "Starting local server with Python 3..."
    echo ""
    echo "Opening: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Open browser if possible
    if command -v open &> /dev/null; then
        open http://localhost:8000 &
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000 &
    fi
    
    sleep 2
    python3 -m http.server 8000
    
# Check if Python 2 is installed
elif command -v python &> /dev/null; then
    echo "Starting local server with Python 2..."
    echo ""
    echo "Opening: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Open browser if possible
    if command -v open &> /dev/null; then
        open http://localhost:8000 &
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000 &
    fi
    
    sleep 2
    python -m SimpleHTTPServer 8000
    
# Check if Node.js is installed
elif command -v node &> /dev/null; then
    echo "Starting local server with Node.js..."
    echo ""
    echo "Opening: http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Open browser if possible
    if command -v open &> /dev/null; then
        open http://localhost:8080 &
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8080 &
    fi
    
    sleep 2
    npx http-server
    
else
    echo "No suitable server found."
    echo ""
    echo "Please install one of the following:"
    echo "  1. Python 3: brew install python3"
    echo "  2. Node.js: https://nodejs.org/"
    echo ""
    echo "Or use VS Code Live Server extension."
    echo ""
fi
