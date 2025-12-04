import boto3
import uuid
import os
import re
from typing import Optional
from fastapi import UploadFile, HTTPException
from automex_backend.config import settings

class S3Service:
    """
    Service for handling AWS S3 file operations.
    This service can be used across the application for uploading and managing files in S3.
    """
    
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.AWS_BUCKET_NAME
        self.folder = settings.AWS_S3_FOLDER

    def _sanitize_username(self, username: str) -> str:
        """
        Sanitize username for use in folder paths.
        Removes or replaces special characters that are not safe for file/folder names.
        
        Args:
            username: The username to sanitize (email or full_name)
        
        Returns:
            str: Sanitized username safe for use in folder paths
        """
        # Replace @ with underscore for email addresses
        sanitized = username.replace('@', '_')
        # Remove or replace other special characters
        sanitized = re.sub(r'[^\w\-_.]', '_', sanitized)
        # Remove multiple consecutive underscores
        sanitized = re.sub(r'_+', '_', sanitized)
        # Remove leading/trailing underscores
        sanitized = sanitized.strip('_')
        return sanitized

    async def upload_file(self, file: UploadFile, folder: Optional[str] = None, username: Optional[str] = None) -> str:
        """
        Upload a file to S3 and return the URL.
        
        Args:
            file: The file to upload
            folder: Optional custom folder path. If not provided, uses default from settings.
            username: Optional username to create user-specific folder structure.
                     If provided, creates folder structure: Backend/my-cars/{username}/
        
        Returns:
            str: The public URL of the uploaded file
        
        Raises:
            HTTPException: If upload fails
        """
        try:
            # Build folder path
            if username:
                # Sanitize username for filesystem safety
                sanitized_username = self._sanitize_username(username)
                # Create user-specific folder: Backend/my-cars/{username}/
                upload_folder = f"Backend/my-cars/{sanitized_username}/"
            elif folder:
                # Use custom folder if provided
                upload_folder = folder
            else:
                # Use default folder from settings
                upload_folder = self.folder
            
            # Generate a unique filename
            file_extension = os.path.splitext(file.filename)[1]
            filename = f"{uuid.uuid4()}{file_extension}"
            key = f"{upload_folder}{filename}"

            # Upload the file
            self.s3_client.upload_fileobj(
                file.file,
                self.bucket_name,
                key,
                ExtraArgs={'ContentType': file.content_type or 'application/octet-stream'}
            )

            # Construct the URL
            url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
            return url

        except Exception as e:
            print(f"Error uploading to S3: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload image to S3: {str(e)}")

    async def delete_file(self, file_url: str) -> bool:
        """
        Delete a file from S3 using its URL.
        
        Args:
            file_url: The full URL of the file to delete
        
        Returns:
            bool: True if deletion was successful, False otherwise
        """
        try:
            # Extract the key from the URL
            # URL format: https://{bucket}.s3.{region}.amazonaws.com/{key}
            if not file_url or self.bucket_name not in file_url:
                print(f"S3 delete failed: Invalid file URL or bucket name mismatch. URL: {file_url}")
                return False
            
            # Extract key from URL
            key = file_url.split(f"{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/")[-1]
            
            if not key:
                print(f"S3 delete failed: Could not extract key from URL: {file_url}")
                return False
            
            # Delete the file
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key
            )
            
            print(f"S3 delete successful: {key}")
            return True

        except Exception as e:
            print(f"Error deleting from S3: {str(e)}")
            print(f"Failed URL: {file_url}")
            # Don't raise exception for delete failures, just log and return False
            return False

    def get_file_key(self, file_url: str) -> Optional[str]:
        """
        Extract the S3 key from a file URL.
        
        Args:
            file_url: The full URL of the file
        
        Returns:
            Optional[str]: The S3 key, or None if URL is invalid
        """
        try:
            if not file_url or self.bucket_name not in file_url:
                return None
            
            key = file_url.split(f"{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/")[-1]
            return key
        except Exception:
            return None

# Global instance
s3_service = S3Service()

