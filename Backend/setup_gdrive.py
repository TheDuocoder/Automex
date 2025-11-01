"""
Google Drive .env Setup Helper Script

This script helps you configure Google Drive sync for your .env file.
"""
import os
import sys
from pathlib import Path


def extract_file_id(link: str) -> str:
    """Extract file ID from Google Drive link"""
    # Handle different Google Drive link formats
    if '/d/' in link:
        # Format: https://drive.google.com/file/d/FILE_ID/view
        return link.split('/d/')[1].split('/')[0]
    elif 'id=' in link:
        # Format: https://drive.google.com/open?id=FILE_ID
        return link.split('id=')[1].split('&')[0]
    else:
        # Assume it's just the file ID
        return link.strip()


def test_download(file_id: str):
    """Test downloading .env file with the given file ID"""
    print(f"\n🧪 Testing download with file ID: {file_id}")
    
    # Set environment variable temporarily
    os.environ['GDRIVE_ENV_FILE_ID'] = file_id
    
    try:
        from automex_backend.services.gdrive_config import setup_env_from_gdrive
        
        success = setup_env_from_gdrive()
        
        if success:
            print("\n✅ Test successful! .env file downloaded.")
            return True
        else:
            print("\n❌ Test failed. Check the error messages above.")
            return False
    
    except Exception as e:
        print(f"\n❌ Error during test: {e}")
        return False


def set_environment_variable(file_id: str):
    """Set the GDRIVE_ENV_FILE_ID environment variable"""
    print(f"\n📝 Setting environment variable...")
    
    if sys.platform == 'win32':
        # Windows
        print("\n📋 Copy and run this command in PowerShell:")
        print(f'[System.Environment]::SetEnvironmentVariable("GDRIVE_ENV_FILE_ID", "{file_id}", "User")')
        print("\n⚠️  You need to restart your terminal/IDE after running this command.")
    else:
        # Linux/Mac
        print("\n📋 Add this line to your ~/.bashrc or ~/.zshrc:")
        print(f'export GDRIVE_ENV_FILE_ID="{file_id}"')
        print("\n⚠️  Run 'source ~/.bashrc' or restart your terminal after adding.")


def main():
    """Main setup wizard"""
    print("\n" + "="*70)
    print("🚀 Google Drive .env Configuration Setup")
    print("="*70)
    
    print("\n📋 This wizard will help you configure automatic .env sync from Google Drive")
    
    # Step 1: Get the link or file ID
    print("\n" + "-"*70)
    print("STEP 1: Google Drive Link/File ID")
    print("-"*70)
    print("\nPlease provide your Google Drive .env file link or file ID:")
    print("\nAccepted formats:")
    print("  1. Full link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing")
    print("  2. Just the FILE_ID: 1ABC123xyz456DEF789")
    
    link = input("\nEnter link or file ID: ").strip()
    
    if not link:
        print("\n❌ No input provided. Exiting.")
        return
    
    # Extract file ID
    file_id = extract_file_id(link)
    print(f"\n✅ Extracted File ID: {file_id}")
    
    # Step 2: Test download
    print("\n" + "-"*70)
    print("STEP 2: Test Download")
    print("-"*70)
    
    test_choice = input("\nDo you want to test the download now? (y/n): ").strip().lower()
    
    if test_choice == 'y':
        success = test_download(file_id)
        
        if not success:
            retry = input("\n❓ Download failed. Do you want to try a different link? (y/n): ").strip().lower()
            if retry == 'y':
                main()  # Restart
                return
    
    # Step 3: Set environment variable
    print("\n" + "-"*70)
    print("STEP 3: Set Environment Variable")
    print("-"*70)
    
    set_environment_variable(file_id)
    
    # Step 4: Final instructions
    print("\n" + "-"*70)
    print("✅ Setup Complete!")
    print("-"*70)
    
    print("\n📝 Next Steps:")
    print("  1. Set the environment variable using the command above")
    print("  2. Restart your terminal/IDE")
    print("  3. Run: python -m automex_backend.main")
    print("  4. The .env file will be automatically downloaded on startup")
    
    print("\n📚 For more details, see: GDRIVE_ENV_SETUP.md")
    
    print("\n" + "="*70)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user.")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()

