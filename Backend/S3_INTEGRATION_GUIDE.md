# AWS S3 Integration Guide

## Overview
This application uses AWS S3 for storing and managing uploaded files (car images, etc.). The S3 service is implemented as a reusable utility that can be used across different parts of the application.

## Configuration

### Environment Variables
Add the following to your `.env` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-south-2
AWS_BUCKET_NAME=automex-bhubaneswar
AWS_S3_FOLDER=Backend/my-cars/
```

### Current Setup
- **Bucket**: automex-bhubaneswar
- **Region**: ap-south-2 (Asia Pacific - Hyderabad)
- **Default Folder**: Backend/my-cars/
- **Access**: Public read access for uploaded files

## S3 Service Usage

### Location
The S3 service is located at: `src/automex_backend/services/s3.py`

### Import
```python
from automex_backend.services.s3 import s3_service
```

### Methods

#### 1. Upload File
```python
async def upload_file(file: UploadFile, folder: Optional[str] = None) -> str:
    """
    Upload a file to S3 and return the URL.
    
    Args:
        file: The file to upload (FastAPI UploadFile)
        folder: Optional custom folder path. If not provided, uses default from settings.
    
    Returns:
        str: The public URL of the uploaded file
    
    Raises:
        HTTPException: If upload fails
    """
```

**Example:**
```python
from fastapi import UploadFile, File
from automex_backend.services.s3 import s3_service

@router.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    # Upload to default folder
    image_url = await s3_service.upload_file(image)
    
    # Or upload to custom folder
    image_url = await s3_service.upload_file(image, folder="Backend/custom-folder/")
    
    return {"url": image_url}
```

#### 2. Delete File
```python
async def delete_file(file_url: str) -> bool:
    """
    Delete a file from S3 using its URL.
    
    Args:
        file_url: The full URL of the file to delete
    
    Returns:
        bool: True if deletion was successful, False otherwise
    """
```

**Example:**
```python
from automex_backend.services.s3 import s3_service

# Delete old image before uploading new one
if old_image_url:
    await s3_service.delete_file(old_image_url)
```

#### 3. Get File Key
```python
def get_file_key(file_url: str) -> Optional[str]:
    """
    Extract the S3 key from a file URL.
    
    Args:
        file_url: The full URL of the file
    
    Returns:
        Optional[str]: The S3 key, or None if URL is invalid
    """
```

**Example:**
```python
from automex_backend.services.s3 import s3_service

url = "https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Backend/my-cars/abc123.jpg"
key = s3_service.get_file_key(url)
# Returns: "Backend/my-cars/abc123.jpg"
```

## API Endpoint Implementation

### Example: Car Image Upload

**Backend (cars.py):**
```python
from fastapi import Form, File, UploadFile
from automex_backend.services.s3 import s3_service

@router.post("/", response_model=CarRead)
async def create_car(
    make: str = Form(...),
    model: str = Form(...),
    year: int = Form(...),
    registration_number: str = Form(...),
    image: UploadFile = File(None),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    image_url = None
    if image:
        image_url = await s3_service.upload_file(image)
    
    car = Car(
        make=make,
        model=model,
        year=year,
        registration_number=registration_number,
        image_url=image_url,
        user_id=user.id
    )
    session.add(car)
    await session.commit()
    await session.refresh(car)
    return car
```

**Frontend (api.ts):**
```typescript
create: async (data: CarCreate, imageFile?: File): Promise<ApiResponse<Car>> => {
    const formData = new FormData();
    formData.append('make', data.make);
    formData.append('model', data.model);
    formData.append('year', data.year.toString());
    formData.append('registration_number', data.registration_number);
    
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const authHeader = getAuthHeader();
    const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/cars/` : '/api/v1/cars/';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            ...authHeader,
            // Don't set Content-Type - browser sets it with boundary
        },
        body: formData,
    });

    const responseData = await response.json().catch(() => null);
    return {
        data: responseData,
        status: response.status,
    };
}
```

## Using S3 Service in Other Sections

### Example: Profile Pictures
```python
# In user profile API
@router.patch("/profile/picture")
async def update_profile_picture(
    image: UploadFile = File(...),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    # Delete old profile picture if exists
    if user.profile_picture_url:
        await s3_service.delete_file(user.profile_picture_url)
    
    # Upload new picture to custom folder
    image_url = await s3_service.upload_file(image, folder="Backend/profile-pictures/")
    
    user.profile_picture_url = image_url
    await session.commit()
    return {"profile_picture_url": image_url}
```

### Example: Service Documents
```python
# In service history API
@router.post("/service-history/{id}/documents")
async def upload_service_document(
    id: int,
    document: UploadFile = File(...),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    # Upload to service documents folder
    document_url = await s3_service.upload_file(
        document, 
        folder="Backend/service-documents/"
    )
    
    # Save document URL to database
    service_doc = ServiceDocument(
        service_history_id=id,
        document_url=document_url,
        filename=document.filename
    )
    session.add(service_doc)
    await session.commit()
    return {"document_url": document_url}
```

## File Naming Convention
Files are automatically renamed with UUID to prevent conflicts:
- Original: `my-car-photo.jpg`
- Stored as: `a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg`

## URL Format
Uploaded files are accessible via:
```
https://{bucket_name}.s3.{region}.amazonaws.com/{folder}{filename}
```

Example:
```
https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Backend/my-cars/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
```

## Security Considerations

1. **Access Keys**: Never commit AWS credentials to version control
2. **Bucket Permissions**: Ensure proper IAM policies are configured
3. **File Validation**: Always validate file types and sizes before upload
4. **CORS**: Configure CORS settings on S3 bucket if needed for direct browser access

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Check AWS credentials and IAM permissions
2. **Upload Fails**: Verify bucket name and region are correct
3. **File Not Accessible**: Check bucket public access settings
4. **Large Files**: Consider implementing multipart upload for files > 5MB

### Debug Logging
The service includes console logging for errors:
```python
print(f"Error uploading to S3: {str(e)}")
print(f"Error deleting from S3: {str(e)}")
```

## Dependencies
- `boto3>=1.34.0` - AWS SDK for Python

Install with:
```bash
pip install boto3
```

Or add to `pyproject.toml`:
```toml
dependencies = [
    "boto3>=1.34.0",
]
```
