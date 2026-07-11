@echo off
:: RealSeek Windows Startup Script
:: Automatically configures environment variables and starts both backend and frontend servers in separate windows.

title RealSeek Orchestrator

echo ==============================================
echo       RealSeek - Starting Application
echo ==============================================

:: Define directory paths
set SCRIPT_DIR=%~dp0
set PYTHON_BIN=%SCRIPT_DIR%venv\Scripts\python.exe

:: Check if virtual environment python exists
if not exist "%PYTHON_BIN%" (
    echo [Error] Virtual environment python not found at:
    echo %PYTHON_BIN%
    echo Please run: python -m venv venv
    echo and install dependencies: venv\Scripts\pip install -r requirements.txt
    pause
    exit /b 1
)

:: Enable CORS headers for web applications
set AGENT_ALLOW_CORS_HEADERS=1
echo [Success] CORS headers enabled (AGENT_ALLOW_CORS_HEADERS=1)

:: Configure PYTHONPATH and AGENT_TOOL_PATH
set AGENT_TOOL_PATH=%SCRIPT_DIR%
set PYTHONPATH=%SCRIPT_DIR%

:: Start Backend in a new command window
echo [Info] Starting Backend (Neuro SAN REST Server)...
start "RealSeek Backend" cmd /c "cd /d "%SCRIPT_DIR%backend" && "%PYTHON_BIN%" run_server.py run --server-only"

:: Wait a moment to let the backend initialize
timeout /t 2 /nobreak >nul

:: Start Frontend in a new command window
echo [Info] Starting Frontend (Lightweight Web Server)...
start "RealSeek Frontend" cmd /c "python -m http.server 5173 --directory "%SCRIPT_DIR%frontend""

echo ==============================================
echo Both servers are running!
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Close the respective window popups to stop the servers.
echo ==============================================
pause
