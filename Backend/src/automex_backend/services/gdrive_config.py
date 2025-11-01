"""
Google Drive Configuration Service
Downloads .env file from Google Drive before app startup

SETUP INSTRUCTIONS:
1. Upload your .env file to Google Drive
2. Right-click on the file → Share → Anyone with the link can view
3. Copy the share link (e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
4. Extract the FILE_ID from the link
5. Set GDRIVE_ENV_FILE_ID environment variable or update this file

Alternative: You can also store credentials in a separate secure location
"""
import os
import requests
from pathlib import Path

# Google Drive File ID for .env file
# Get this by sharing your .env file and extracting ID from the link
GDRIVE_ENV_FILE_ID = os.getenv("GDRIVE_ENV_FILE_ID", "")


class GoogleDriveConfigService:
    """Service to download .env file from Google Drive using public link"""
    
    def __init__(self):
        self.backend_dir = Path(__file__).parent.parent.parent.parent
        self.env_file_path = self.backend_dir / ".env"
        self.file_id = GDRIVE_ENV_FILE_ID
    
    def download_from_gdrive(self, file_id: str = None):
        """
        Download file from Google Drive using file ID
        
        Args:
            file_id: Google Drive file ID (from shareable link)
        
        Returns:
            bool: True if download successful
        """
        if not file_id and not self.file_id:
            print("[ERROR] Google Drive file ID not configured")
            return False
        
        file_id = file_id or self.file_id
        
        try:
            print(f"[INFO] Downloading .env file from Google Drive...")
            
            # Google Drive direct download URL
            url = f"https://drive.google.com/uc?export=download&id={file_id}"
            
            # Download file
            response = requests.get(url, stream=True)
            
            # Check if download was successful
            if response.status_code != 200:
                print(f"[ERROR] Failed to download file. Status code: {response.status_code}")
                return False
            
            # Check if we got a confirmation page (for large files)
            if 'text/html' in response.headers.get('Content-Type', ''):
                # Try to get the confirmation link
                print("[WARNING] File requires confirmation. Attempting direct download...")
                
                # For large files, Google Drive requires confirmation
                # Try alternative download method
                session = requests.Session()
                response = session.get(url, stream=True)
                
                # Look for confirmation token
                for key, value in response.cookies.items():
                    if key.startswith('download_warning'):
                        confirm_url = f"{url}&confirm={value}"
                        response = session.get(confirm_url, stream=True)
                        break
            
            # Write to .env file
            with open(self.env_file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            print(f"[SUCCESS] .env file downloaded successfully from Google Drive")
            print(f"          Location: {self.env_file_path}")
            return True
        
        except Exception as e:
            print(f"[ERROR] Error downloading .env file: {e}")
            return False
    
    def sync_env_from_gdrive(self):
        """Main method to sync .env from Google Drive"""
        print("\n[INFO] Attempting to sync .env file from Google Drive...")
        
        # Check if file ID is configured
        if not self.file_id:
            print("[WARNING] GDRIVE_ENV_FILE_ID not configured")
            print("[INFO] Using existing .env file if available")
            return self.env_file_path.exists()
        
        # Download .env file
        success = self.download_from_gdrive()
        
        if not success:
            print("[WARNING] Could not download .env from Google Drive")
            print("[INFO] Using existing .env file if available")
            return self.env_file_path.exists()
        
        return True


# Singleton instance
gdrive_config_service = GoogleDriveConfigService()


def setup_env_from_gdrive():
    """
    Setup function to be called before app starts
    Downloads .env from Google Drive if configured
    """
    # Check if we should sync from Google Drive
    sync_enabled = os.getenv("SYNC_ENV_FROM_GDRIVE", "true").lower() == "true"
    
    if not sync_enabled:
        print("[INFO] Google Drive sync disabled")
        return True
    
    try:
        return gdrive_config_service.sync_env_from_gdrive()
    except Exception as e:
        print(f"[WARNING] Error syncing from Google Drive: {e}")
        print("[INFO] Continuing with existing .env file")
        return True

