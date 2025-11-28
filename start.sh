#!/bin/bash

# Complaint Box - Start Script
# This script starts both frontend and backend servers

echo "🚀 Starting Complaint Box Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend server
echo "📦 Starting Backend Server..."
cd "$SCRIPT_DIR/backend"
npm start &
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"
echo ""

# Wait a moment for backend to initialize
sleep 2

# Start frontend server
echo "🎨 Starting Frontend Server..."
cd "$SCRIPT_DIR/frontend"
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started with PID: $FRONTEND_PID"
echo ""

echo "================================================"
echo "✨ Complaint Box is running!"
echo "================================================"
echo "Backend:  http://localhost:4000"
echo "Frontend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "================================================"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT TERM

# Wait for both processes
wait
