# Installing MySQL Dependencies

The `pymysql` and `aiomysql` packages are already added to `pyproject.toml`. 

## Option 1: Using uv (Recommended)

If you have `uv` installed, run from the Backend directory:

```powershell
cd D:\Automex\Backend
uv sync
```

This will install all dependencies including `pymysql` and `aiomysql`.

## Option 2: Using pip with virtual environment

If you don't have `uv` or prefer pip:

```powershell
cd D:\Automex\Backend

# Activate virtual environment (if exists)
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install pymysql aiomysql
```

## Option 3: Run as Administrator

If you need to install globally (not recommended):

1. Open PowerShell as Administrator
2. Navigate to Backend directory
3. Run: `python -m uv pip install --system pymysql aiomysql`

## Verify Installation

After installation, verify it works:

```powershell
python -c "import pymysql; import aiomysql; print('Success! MySQL dependencies installed.')"
```

## Note

The `pyproject.toml` file already includes:
- `pymysql>=1.0.0`
- `aiomysql>=0.2.0`

So running `uv sync` should install everything automatically.

