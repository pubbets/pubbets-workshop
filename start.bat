@echo off
REM ============================================================
REM  Pubbets Workshop - Custom Puppet Builder
REM  Double-click to run. Starts a local web server, waits for
REM  it to be ready, THEN opens the builder in your browser.
REM ============================================================
title Pubbets Workshop Builder
cd /d "%~dp0"
color 0A

echo.
echo   ============================================
echo    Pubbets Workshop - Custom Puppet Builder
echo   ============================================
echo.
echo   Looking for a way to run the local server...
echo.

REM --- Try Python (test it actually runs, not just that it exists) ---
py --version >nul 2>nul
if %errorlevel%==0 (
  echo   Using Python. Starting server...
  start "Pubbets Server" cmd /k "cd /d "%~dp0" && py serve.py"
  goto :wait
)

python --version >nul 2>nul
if %errorlevel%==0 (
  echo   Using Python. Starting server...
  start "Pubbets Server" cmd /k "cd /d "%~dp0" && python serve.py"
  goto :wait
)

REM --- Try Node ---
node --version >nul 2>nul
if %errorlevel%==0 (
  echo   Using Node. Starting server...
  start "Pubbets Server" cmd /k "cd /d "%~dp0" && node server.js"
  goto :wait
)

REM --- Nothing found ---
color 0C
echo.
echo   X  Could not find Python or Node on this computer.
echo.
echo   Easiest fix: install Python (free, 2 minutes):
echo     1. Go to  https://www.python.org/downloads/
echo     2. Run the installer
echo     3. IMPORTANT: tick "Add Python to PATH" on the first screen
echo     4. Then double-click start.bat again
echo.
pause
goto :eof

:wait
echo.
echo   Server starting - waiting a moment so it's ready...
timeout /t 3 /nobreak >nul
echo   Opening the builder in your browser...
start "" http://localhost:8000/index.html
echo.
echo   ============================================
echo    You're all set!
echo.
echo    A second window titled "Pubbets Server" is
echo    now running the app. Keep it open while you
echo    use the builder. Close it when you're done.
echo.
echo    Builder:  http://localhost:8000/index.html
echo    Admin:    http://localhost:8000/admin.html
echo   ============================================
echo.
echo   (You can close THIS window now.)
timeout /t 8 /nobreak >nul
