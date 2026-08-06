@echo off
setlocal
title Pubbets Workshop v1.0
cd /d "%~dp0"

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm are required to run Pubbets Workshop.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing Pubbets Workshop dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

start "Pubbets Workshop Server" /min cmd /k "cd /d "%~dp0" && npm.cmd run dev"
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:8000/

echo Pubbets Workshop is opening at http://127.0.0.1:8000/
echo Keep the minimized server window open while using the app.
timeout /t 5 /nobreak >nul
endlocal
