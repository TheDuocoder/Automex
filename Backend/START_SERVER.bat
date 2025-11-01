@echo off
echo ========================================
echo    AUTOMEX BACKEND SERVER
echo ========================================
echo.

cd /d "%~dp0"

echo Checking virtual environment...
if not exist ".venv\Scripts\python.exe" (
    echo.
    echo ERROR: Virtual environment not found!
    echo Running uv sync to create it...
    echo.
    uv sync
    echo.
)

echo.
echo Starting FastAPI backend server...
echo.
echo API will be available at:
echo   - http://localhost:8000
echo   - http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call .venv\Scripts\activate.bat
python -m uvicorn automex_backend.main:app --reload --host 0.0.0.0 --port 8000

pause

