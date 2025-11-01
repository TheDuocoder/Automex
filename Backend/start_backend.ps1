Set-Location 'D:\Automex\Backend'
& '.\.venv\Scripts\Activate.ps1'
python -m uvicorn automex_backend.main:app --reload --host 0.0.0.0 --port 8000
