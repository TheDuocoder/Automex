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

    async def upload_file(self, file: UploadFile, folder: Optional[str] = None, username: Optional[str] = None, booking_email: Optional[str] = None, date_folder: Optional[str] = None) -> str:
        """
        Upload a file to S3 and return the URL.
        
        Args:
            file: The file to upload
            folder: Optional custom folder path. If not provided, uses default from settings.
            username: Optional username to create user-specific folder structure.
                     If provided, creates folder structure: Backend/my-cars/{username}/
            booking_email: Optional email for booking folder structure.
                          If provided, creates folder structure: Backend/bookings/{sanitized_email}/
            date_folder: Optional date folder (YYYY-MM-DD format) for booking media.
                        If provided with booking_email, creates: Backend/bookings/{email}/{date}/
        
        Returns:
            str: The public URL of the uploaded file
        
        Raises:
            HTTPException: If upload fails
        """
        try:
            # Build folder path
            if booking_email:
                # Sanitize email for filesystem safety
                sanitized_email = self._sanitize_username(booking_email)
                if date_folder:
                    # Create date-based folder: Backend/bookings/{email}/{date}/
                    # Validate date format (YYYY-MM-DD)
                    if not re.match(r'^\d{4}-\d{2}-\d{2}$', date_folder):
                        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
                    upload_folder = f"Backend/bookings/{sanitized_email}/{date_folder}/"
                else:
                    # Create booking-specific folder: Backend/bookings/{email}/
                    upload_folder = f"Backend/bookings/{sanitized_email}/"
            elif username:
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

    async def delete_files_by_date_folder(self, booking_email: str, date_folder: str) -> int:
        """
        Delete all files in a date folder for a booking.
        
        Args:
            booking_email: The email of the booking owner
            date_folder: Date folder in YYYY-MM-DD format
        
        Returns:
            int: Number of files deleted
        """
        try:
            # Validate date format
            if not re.match(r'^\d{4}-\d{2}-\d{2}$', date_folder):
                print(f"[ERROR] Invalid date format: {date_folder}")
                return 0
            
            # Sanitize email
            sanitized_email = self._sanitize_username(booking_email)
            folder_prefix = f"Backend/bookings/{sanitized_email}/{date_folder}/"
            
            # List all objects with this prefix
            paginator = self.s3_client.get_paginator('list_objects_v2')
            deleted_count = 0
            
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=folder_prefix):
                if 'Contents' not in page:
                    continue
                
                # Delete all objects in this page
                objects_to_delete = [{'Key': obj['Key']} for obj in page['Contents']]
                if objects_to_delete:
                    response = self.s3_client.delete_objects(
                        Bucket=self.bucket_name,
                        Delete={'Objects': objects_to_delete}
                    )
                    deleted_count += len([obj for obj in response.get('Deleted', [])])
                    print(f"[INFO] Deleted {len(objects_to_delete)} files from {folder_prefix}")
            
            print(f"[INFO] Total files deleted from {folder_prefix}: {deleted_count}")
            return deleted_count
            
        except Exception as e:
            print(f"[ERROR] Error deleting files from date folder {date_folder}: {str(e)}")
            return 0

# Global instance
s3_service = S3Service()

