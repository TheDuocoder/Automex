"""
File upload API routes using ImageKit
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import JSONResponse

from automex_backend.services.imagekit_service import imagekit_service
from automex_backend.api.auth import current_active_user
from automex_backend.models.user import User

router = APIRouter()


@router.post("/service-image", status_code=status.HTTP_201_CREATED)
async def upload_service_image(
    file: UploadFile = File(...),
    service_name: str = Form(...),
    user: User = Depends(current_active_user)
):
    """
    Upload a service image to ImageKit
    Requires authentication (admin only for services)
    """
    # Only superusers can upload service images
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can upload service images"
        )
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload to ImageKit
        result = imagekit_service.upload_service_image(
            file=file_content,
            file_name=file.filename,
            service_name=service_name
        )
        
        if result.get("success"):
            return {
                "message": "Service image uploaded successfully",
                "file_id": result["file_id"],
                "url": result["url"],
                "file_path": result["file_path"]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Upload failed")
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )


@router.post("/vehicle-image", status_code=status.HTTP_201_CREATED)
async def upload_vehicle_image(
    file: UploadFile = File(...),
    booking_id: int = Form(...),
    image_type: str = Form(default="before"),
    user: User = Depends(current_active_user)
):
    """
    Upload a vehicle image for a booking
    Requires authentication
    """
    # Validate image type
    valid_types = ["before", "after", "during"]
    if image_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Image type must be one of: {', '.join(valid_types)}"
        )
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload to ImageKit
        result = imagekit_service.upload_vehicle_image(
            file=file_content,
            file_name=file.filename,
            booking_id=booking_id,
            image_type=image_type
        )
        
        if result.get("success"):
            return {
                "message": "Vehicle image uploaded successfully",
                "file_id": result["file_id"],
                "url": result["url"],
                "file_path": result["file_path"],
                "booking_id": booking_id,
                "image_type": image_type
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Upload failed")
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )


@router.post("/promotional", status_code=status.HTTP_201_CREATED)
async def upload_promotional_content(
    file: UploadFile = File(...),
    content_type: str = Form(default="banner"),
    user: User = Depends(current_active_user)
):
    """
    Upload promotional content (banners, ads, videos)
    Requires authentication (admin only)
    """
    # Only superusers can upload promotional content
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can upload promotional content"
        )
    
    # Validate content type
    valid_types = ["banner", "ad", "video"]
    if content_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Content type must be one of: {', '.join(valid_types)}"
        )
    
    # Validate file type
    if content_type == "video":
        if not file.content_type.startswith("video/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only video files are allowed for video content"
            )
    else:
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only image files are allowed for banners and ads"
            )
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload to ImageKit
        result = imagekit_service.upload_promotional_content(
            file=file_content,
            file_name=file.filename,
            content_type=content_type
        )
        
        if result.get("success"):
            return {
                "message": "Promotional content uploaded successfully",
                "file_id": result["file_id"],
                "url": result["url"],
                "file_path": result["file_path"],
                "content_type": content_type
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Upload failed")
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )


@router.get("/file/{file_id}")
async def get_file_details(
    file_id: str,
    user: User = Depends(current_active_user)
):
    """
    Get details of an uploaded file
    Requires authentication
    """
    try:
        result = imagekit_service.get_file_details(file_id)
        
        if result.get("success"):
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving file details: {str(e)}"
        )


@router.delete("/file/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    file_id: str,
    user: User = Depends(current_active_user)
):
    """
    Delete a file from ImageKit
    Requires authentication (admin only)
    """
    # Only superusers can delete files
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete files"
        )
    
    try:
        result = imagekit_service.delete_file(file_id)
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found or already deleted"
            )
        
        return None
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )


@router.get("/list")
async def list_files(
    folder: Optional[str] = None,
    tags: Optional[str] = None,
    limit: int = 100,
    user: User = Depends(current_active_user)
):
    """
    List files from ImageKit
    Requires authentication (admin only)
    
    Query params:
    - folder: Subfolder within /Automex (e.g., 'services', 'vehicles')
    - tags: Comma-separated tags to filter by
    - limit: Maximum number of files to return (default: 100)
    """
    # Only superusers can list all files
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can list files"
        )
    
    try:
        tags_list = tags.split(",") if tags else None
        
        result = imagekit_service.list_files(
            folder=folder,
            tags=tags_list,
            limit=limit
        )
        
        if result.get("success"):
            return {
                "files": result["files"],
                "count": result["count"],
                "folder": folder or "/Automex",
                "tags": tags_list
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Failed to list files")
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing files: {str(e)}"
        )

