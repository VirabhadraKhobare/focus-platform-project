# Local deploy script for FocusFlow (PowerShell)
# - Starts backend and frontend locally without Docker
# - Requires Node.js installed

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Starting FocusFlow local deploy..."

# Start backend
Write-Host "Starting backend..."
Start-Process -NoNewWindow -WorkingDirectory "$root\backend" -FilePath "powershell" -ArgumentList "-NoExit -Command \"npm install; if (Test-Path package.json) { try { npm run build } catch { Write-Output 'No build script or build failed' } }; $env:PORT=4000; node stable-backend.js\""

# Start frontend (Vite)
Write-Host "Starting frontend (Vite)..."
Start-Process -NoNewWindow -WorkingDirectory "$root\frontend" -FilePath "powershell" -ArgumentList "-NoExit -Command \"npm install; npm run dev\""

Write-Host "Started backend and frontend. Check their terminals for logs."
