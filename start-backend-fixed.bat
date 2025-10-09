@echo off
echo Starting FocusFlow Backend...
cd /d "c:\Users\virbh\OneDrive\Desktop\Project\focusflow_mvp-project\backend"

REM Kill any existing node processes
taskkill /f /im node.exe 2>nul

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start the backend server
echo Starting backend server on port 4000...
node minimal-backend.js

pause