# Setup .env file for AutoMex Backend
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   CREATING .env FILE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

$envContent = @"
# AutoMex Backend Configuration

# Application Settings
APP_NAME=AutoMex API
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=sqlite+aiosqlite:///./automex.db

# Security
SECRET_KEY=your-secret-key-change-this-in-production-make-it-very-long-and-random

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080,http://localhost:8081,http://localhost:8082,http://127.0.0.1:5173,http://127.0.0.1:3000,http://127.0.0.1:8080

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=public_lVFHk5WRbmDAfmuhdoa80cTEtRw=
IMAGEKIT_PRIVATE_KEY=private_3kBJMEY/pUeydmiHA783IZ+7PAc=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xo3judaw9

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Google Drive Config (Optional)
GDRIVE_ENV_FILE_ID=
"@

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host "`n.env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Keeping existing .env file" -ForegroundColor Green
        exit
    }
}

$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Host "`n✓ .env file created successfully!" -ForegroundColor Green
Write-Host "Location: $envPath" -ForegroundColor White
Write-Host "`n========================================" -ForegroundColor Cyan

