@echo off
echo Starting FocusFlow Frontend...
cd /d "c:\Users\virbh\OneDrive\Desktop\Project\focusflow_mvp-project\frontend"

REM Make sure dependencies are installed
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

REM Start the frontend
echo Starting frontend development server...
npm run dev

pause