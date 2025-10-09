@echo off
title FocusFlow Backend Server
color 0A

echo ==========================================
echo    Starting FocusFlow Backend Server
echo ==========================================

cd /d "c:\Users\virbh\OneDrive\Desktop\Project\focusflow_mvp-project\backend"

REM Kill any existing node processes
echo Stopping any existing servers...
taskkill /f /im node.exe 2>nul >nul

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Check if the stable backend exists
if not exist "stable-backend.js" (
    echo Error: stable-backend.js not found!
    echo Using minimal-backend.js instead...
    if exist "minimal-backend.js" (
        node minimal-backend.js
    ) else (
        echo Error: No backend server found!
        pause
        exit /b 1
    )
) else (
    echo Starting stable backend server...
    node stable-backend.js
)

echo.
echo Press any key to stop the server...
pause >nul