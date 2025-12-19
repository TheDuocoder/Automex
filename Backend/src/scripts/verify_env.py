import os
import sys
from pathlib import Path

# Add the parent directory to sys.path to allow importing from automex_backend
# Assuming this script is at Backend/src/scripts/verify_env.py
current_file = Path(__file__).resolve()
backend_src_dir = current_file.parent.parent
sys.path.append(str(backend_src_dir))

def check_env_vars():
    """
    Check for critical environment variables and print their status.
    """
    print("\n" + "="*60)
    print("AutoMex Environment Verification")
    print("="*60 + "\n")

    # Try to load .env manually first
    from dotenv import load_dotenv
    env_path = backend_src_dir.parent / ".env"
    print(f"[INFO] Looking for .env file at: {env_path}")
    if env_path.exists():
        print(f"[SUCCESS] Found .env file (Size: {env_path.stat().st_size} bytes)")
        load_dotenv(env_path)
    else:
        print("[WARNING] .env file NOT found locally")

    # List of variables to check
    required_vars = [
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_REGION",
        "AWS_BUCKET_NAME",
        "GDRIVE_ENV_FILE_ID"
    ]

    missing_vars = []
    
    print("\n[INFO] Checking Environment Variables:")
    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Mask sensitive values
            if "KEY" in var or "SECRET" in var or "ID" in var:
                masked_value = value[:4] + "*" * (len(value) - 8) + value[-4:] if len(value) > 8 else "***"
                print(f"  [OK] {var}: {masked_value}")
            else:
                print(f"  [OK] {var}: {value}")
        else:
            print(f"  [MISSING] {var}")
            missing_vars.append(var)

    print("\n" + "-"*60)
    if missing_vars:
        print(f"[ERROR] Missing {len(missing_vars)} required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        print("\nPossible solutions:")
        print("1. Ensure your .env file exists and is populated inside the Backend/ directory.")
        print("2. If using Google Drive sync, check if GDRIVE_ENV_FILE_ID is set correctly.")
        print("3. Check if the application has permissions to read the .env file.")
    else:
        print("[SUCCESS] All required environment variables are present!")

    print("="*60 + "\n")

if __name__ == "__main__":
    check_env_vars()
