"""
ImageKit service for handling image and video uploads
"""
from typing import Optional, Dict, Any, BinaryIO
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

from automex_backend.config import settings


class ImageKitService:
    """Service class for ImageKit operations"""
    
    def __init__(self):
        """Initialize ImageKit client"""
        self._imagekit = None
        self.folder_path = "/Automex"  # Folder in ImageKit
    
    @property
    def imagekit(self):
        """Lazy initialization of ImageKit client"""
        if self._imagekit is None:
            if not settings.IMAGEKIT_PRIVATE_KEY or not settings.IMAGEKIT_PUBLIC_KEY:
                raise ValueError("ImageKit credentials not configured")
            
            self._imagekit = ImageKit(
                private_key=settings.IMAGEKIT_PRIVATE_KEY,
                public_key=settings.IMAGEKIT_PUBLIC_KEY,
                url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
            )
        return self._imagekit
    
    def upload_file(
        self,
        file: BinaryIO,
        file_name: str,
        folder: Optional[str] = None,
        tags: Optional[list] = None,
        custom_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Upload a file (image or video) to ImageKit
        
        Args:
            file: File object to upload
            file_name: Name of the file
            folder: Subfolder within /Automex (optional)
            tags: List of tags for the file
            custom_metadata: Custom metadata for the file
            
        Returns:
            Dict containing file details (url, file_id, etc.)
        """
        # Construct folder path
        upload_folder = self.folder_path
        if folder:
            upload_folder = f"{self.folder_path}/{folder.strip('/')}"
        
        # Prepare upload options
        options = UploadFileRequestOptions(
            folder=upload_folder,
            tags=tags or [],
            use_unique_file_name=True,
            response_fields=["url", "fileId", "name", "size", "filePath", "tags", "fileType"]
        )
        
        if custom_metadata:
            options.custom_metadata = custom_metadata
        
        # Upload file
        result = self.imagekit.upload_file(
            file=file,
            file_name=file_name,
            options=options
        )
        
        if result.response_metadata.http_status_code == 200:
            return {
                "success": True,
                "file_id": result.file_id,
                "file_name": result.name,
                "url": result.url,
                "file_path": result.file_path,
                "size": result.size,
                "file_type": result.file_type,
                "tags": result.tags if hasattr(result, 'tags') else [],
            }
        else:
            return {
                "success": False,
                "error": result.error if hasattr(result, 'error') else "Upload failed"
            }
    
    def upload_service_image(
        self,
        file: BinaryIO,
        file_name: str,
        service_name: str
    ) -> Dict[str, Any]:
        """
        Upload a service-related image to ImageKit
        
        Args:
            file: File object to upload
            file_name: Name of the file
            service_name: Name of the service (used for tagging)
            
        Returns:
            Dict containing file details
        """
        return self.upload_file(
            file=file,
            file_name=file_name,
            folder="services",
            tags=["service", service_name.lower().replace(" ", "_")],
            custom_metadata={"type": "service_image", "service": service_name}
        )
    
    def upload_vehicle_image(
        self,
        file: BinaryIO,
        file_name: str,
        booking_id: int,
        image_type: str = "before"
    ) -> Dict[str, Any]:
        """
        Upload a vehicle image to ImageKit
        
        Args:
            file: File object to upload
            file_name: Name of the file
            booking_id: Booking ID
            image_type: Type of image (before/after/during)
            
        Returns:
            Dict containing file details
        """
        return self.upload_file(
            file=file,
            file_name=file_name,
            folder=f"vehicles/booking_{booking_id}",
            tags=["vehicle", image_type, f"booking_{booking_id}"],
            custom_metadata={
                "type": "vehicle_image",
                "booking_id": str(booking_id),
                "image_type": image_type
            }
        )
    
    def upload_promotional_content(
        self,
        file: BinaryIO,
        file_name: str,
        content_type: str = "banner"
    ) -> Dict[str, Any]:
        """
        Upload promotional content (banners, ads, etc.)
        
        Args:
            file: File object to upload
            file_name: Name of the file
            content_type: Type of content (banner/ad/video)
            
        Returns:
            Dict containing file details
        """
        return self.upload_file(
            file=file,
            file_name=file_name,
            folder="promotional",
            tags=["promotional", content_type],
            custom_metadata={"type": "promotional", "content_type": content_type}
        )
    
    def get_file_details(self, file_id: str) -> Dict[str, Any]:
        """
        Get details of a file from ImageKit
        
        Args:
            file_id: ID of the file
            
        Returns:
            Dict containing file details
        """
        result = self.imagekit.get_file_details(file_id)
        
        if result.response_metadata.http_status_code == 200:
            return {
                "success": True,
                "file_id": result.file_id,
                "name": result.name,
                "url": result.url,
                "file_path": result.file_path,
                "size": result.size,
                "file_type": result.file_type,
            }
        else:
            return {
                "success": False,
                "error": "File not found"
            }
    
    def delete_file(self, file_id: str) -> Dict[str, Any]:
        """
        Delete a file from ImageKit
        
        Args:
            file_id: ID of the file to delete
            
        Returns:
            Dict with success status
        """
        result = self.imagekit.delete_file(file_id)
        
        if result.response_metadata.http_status_code == 204:
            return {"success": True, "message": "File deleted successfully"}
        else:
            return {"success": False, "error": "Failed to delete file"}
    
    def list_files(
        self,
        folder: Optional[str] = None,
        tags: Optional[list] = None,
        limit: int = 100
    ) -> Dict[str, Any]:
        """
        List files from ImageKit
        
        Args:
            folder: Folder path to list files from
            tags: Filter by tags
            limit: Maximum number of files to return
            
        Returns:
            Dict containing list of files
        """
        search_folder = self.folder_path
        if folder:
            search_folder = f"{self.folder_path}/{folder.strip('/')}"
        
        options = {
            "path": search_folder,
            "limit": limit
        }
        
        if tags:
            options["tags"] = ",".join(tags)
        
        result = self.imagekit.list_files(options)
        
        if result.response_metadata.http_status_code == 200:
            files = []
            for file in result.list:
                files.append({
                    "file_id": file.file_id,
                    "name": file.name,
                    "url": file.url,
                    "file_path": file.file_path,
                    "size": file.size,
                    "file_type": file.file_type,
                })
            
            return {
                "success": True,
                "files": files,
                "count": len(files)
            }
        else:
            return {
                "success": False,
                "error": "Failed to list files",
                "files": []
            }


# Create singleton instance
imagekit_service = ImageKitService()

