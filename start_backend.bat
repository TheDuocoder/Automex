@echo off
cd Backend
if exist automex.db del automex.db
echo.
echo ========================================
echo   STARTING BACKEND SERVER
echo ========================================
echo.
call .venv\Scripts\activate.bat
python -m uvicorn automex_backend.main:app --reload --host 0.0.0.0 --port 8000
pause

