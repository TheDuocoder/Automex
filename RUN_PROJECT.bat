@echo off
color 0A
echo.
echo ========================================
echo   AUTOMEX PROJECT LAUNCHER
echo ========================================
echo.
echo Starting Backend and Frontend servers...
echo.
echo Close this window when done.
echo.

start "AutoMex Backend" cmd /k "cd Backend && if exist automex.db del automex.db && .venv\Scripts\activate.bat && python -m uvicorn automex_backend.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak >nul

start "AutoMex Frontend" cmd /k "cd Frontend && npm run dev"

timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   SERVERS STARTING...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:8080
echo.
echo Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:8080
echo.
echo ========================================
echo   PROJECT IS RUNNING!
echo ========================================
echo.
echo Close the server windows to stop the project.
echo.
pause

