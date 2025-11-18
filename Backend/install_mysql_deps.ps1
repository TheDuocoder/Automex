# Install MySQL dependencies using uv
# Run this script from the Backend directory

Write-Host "Installing MySQL dependencies (pymysql and aiomysql)..."

# Try to use uv if available
if (Get-Command uv -ErrorAction SilentlyContinue) {
    Write-Host "Using uv to sync dependencies..."
    uv sync
    Write-Host "Dependencies installed successfully!"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "uv not found. Trying to install using pip..."
    
    # Check if virtual environment exists
    if (Test-Path .venv) {
        Write-Host "Installing to virtual environment..."
        .\.venv\Scripts\python.exe -m pip install pymysql aiomysql
    } else {
        Write-Host "No virtual environment found. Installing to user site..."
        python -m pip install --user pymysql aiomysql
    }
    
    Write-Host "Dependencies installed successfully!"
} else {
    Write-Host "Error: Neither uv nor python found. Please install Python first."
    exit 1
}

Write-Host ""
Write-Host "To verify installation, run:"
Write-Host "  python -c 'import pymysql; import aiomysql; print(\"Success!\")'"

