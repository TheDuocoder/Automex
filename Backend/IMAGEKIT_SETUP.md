# ImageKit Integration - AutoMex Backend

## 📸 Overview

ImageKit is configured to store all media files (images and videos) for the AutoMex platform in the `/Automex` folder.

## 🔑 Configuration

The following credentials have been configured in `.env`:

```env
IMAGEKIT_PUBLIC_KEY=public_lVFHk5WRbmDAfmuhdoa80cTEtRw=
IMAGEKIT_PRIVATE_KEY=private_3kBJMEY/pUeydmiHA783IZ+7PAc=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xo3judaw9
```

## 📁 Folder Structure in ImageKit

All files are organized under `/Automex/`:

```
/Automex/
├── services/              # Service images
├── vehicles/              # Vehicle images (before/after/during service)
│   ├── booking_1/
│   ├── booking_2/
│   └── ...
└── promotional/           # Banners, ads, promotional videos
```

## 🚀 API Endpoints

### 1. Upload Service Image (Admin Only)

Upload images for car services (AC Service, Battery, Tyres, etc.)

**Endpoint:** `POST /api/v1/uploads/service-image`

**Authentication:** Required (Admin only)

**Form Data:**
- `file`: Image file (required)
- `service_name`: Name of the service (required)

**Example using cURL:**
```bash
curl -X POST "http://localhost:8000/api/v1/uploads/service-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "service_name=AC Service"
```

**Response:**
```json
{
  "message": "Service image uploaded successfully",
  "file_id": "abc123...",
  "url": "https://ik.imagekit.io/xo3judaw9/Automex/services/image_xyz.jpg",
  "file_path": "/Automex/services/image_xyz.jpg"
}
```

---

### 2. Upload Vehicle Image

Upload vehicle images (before/after/during service) for a booking

**Endpoint:** `POST /api/v1/uploads/vehicle-image`

**Authentication:** Required

**Form Data:**
- `file`: Image file (required)
- `booking_id`: Booking ID (required)
- `image_type`: Type of image - `before`, `after`, or `during` (default: `before`)

**Example using cURL:**
```bash
curl -X POST "http://localhost:8000/api/v1/uploads/vehicle-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/vehicle.jpg" \
  -F "booking_id=123" \
  -F "image_type=before"
```

**Response:**
```json
{
  "message": "Vehicle image uploaded successfully",
  "file_id": "def456...",
  "url": "https://ik.imagekit.io/xo3judaw9/Automex/vehicles/booking_123/vehicle_xyz.jpg",
  "file_path": "/Automex/vehicles/booking_123/vehicle_xyz.jpg",
  "booking_id": 123,
  "image_type": "before"
}
```

---

### 3. Upload Promotional Content (Admin Only)

Upload promotional banners, ads, or videos

**Endpoint:** `POST /api/v1/uploads/promotional`

**Authentication:** Required (Admin only)

**Form Data:**
- `file`: Image or video file (required)
- `content_type`: Type - `banner`, `ad`, or `video` (default: `banner`)

**Example using cURL:**
```bash
curl -X POST "http://localhost:8000/api/v1/uploads/promotional" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/banner.jpg" \
  -F "content_type=banner"
```

**Response:**
```json
{
  "message": "Promotional content uploaded successfully",
  "file_id": "ghi789...",
  "url": "https://ik.imagekit.io/xo3judaw9/Automex/promotional/banner_xyz.jpg",
  "file_path": "/Automex/promotional/banner_xyz.jpg",
  "content_type": "banner"
}
```

---

### 4. Get File Details

Get details of an uploaded file

**Endpoint:** `GET /api/v1/uploads/file/{file_id}`

**Authentication:** Required

**Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/uploads/file/abc123..." \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "file_id": "abc123...",
  "name": "image_xyz.jpg",
  "url": "https://ik.imagekit.io/xo3judaw9/Automex/services/image_xyz.jpg",
  "file_path": "/Automex/services/image_xyz.jpg",
  "size": 102400,
  "file_type": "image"
}
```

---

### 5. List Files (Admin Only)

List all files from ImageKit with optional filters

**Endpoint:** `GET /api/v1/uploads/list`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `folder`: Subfolder name (e.g., `services`, `vehicles`, `promotional`)
- `tags`: Comma-separated tags to filter by
- `limit`: Maximum number of files (default: 100)

**Example:**
```bash
# List all service images
curl -X GET "http://localhost:8000/api/v1/uploads/list?folder=services&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# List files by tags
curl -X GET "http://localhost:8000/api/v1/uploads/list?tags=service,ac_service" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "files": [
    {
      "file_id": "abc123...",
      "name": "image_xyz.jpg",
      "url": "https://ik.imagekit.io/xo3judaw9/Automex/services/image_xyz.jpg",
      "file_path": "/Automex/services/image_xyz.jpg",
      "size": 102400,
      "file_type": "image"
    }
  ],
  "count": 1,
  "folder": "services",
  "tags": ["service", "ac_service"]
}
```

---

### 6. Delete File (Admin Only)

Delete a file from ImageKit

**Endpoint:** `DELETE /api/v1/uploads/file/{file_id}`

**Authentication:** Required (Admin only)

**Example:**
```bash
curl -X DELETE "http://localhost:8000/api/v1/uploads/file/abc123..." \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `204 No Content`

---

## 🎯 Usage in Frontend

### React Example - Upload Service Image

```typescript
const uploadServiceImage = async (file: File, serviceName: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('service_name', serviceName);

  const response = await fetch('http://localhost:8000/api/v1/uploads/service-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${yourJwtToken}`
    },
    body: formData
  });

  const data = await response.json();
  console.log('Uploaded image URL:', data.url);
  return data;
};
```

### React Example - Upload Vehicle Image

```typescript
const uploadVehicleImage = async (file: File, bookingId: number, imageType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('booking_id', bookingId.toString());
  formData.append('image_type', imageType);

  const response = await fetch('http://localhost:8000/api/v1/uploads/vehicle-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${yourJwtToken}`
    },
    body: formData
  });

  const data = await response.json();
  return data;
};
```

---

## 📝 Tags System

Files are automatically tagged for easy filtering:

### Service Images
- Tags: `["service", "{service_name}"]`
- Example: `["service", "ac_service"]`

### Vehicle Images
- Tags: `["vehicle", "{image_type}", "booking_{id}"]`
- Example: `["vehicle", "before", "booking_123"]`

### Promotional Content
- Tags: `["promotional", "{content_type}"]`
- Example: `["promotional", "banner"]`

---

## 🔒 Security & Permissions

| Endpoint | User | Admin |
|----------|------|-------|
| Upload Service Image | ❌ | ✅ |
| Upload Vehicle Image | ✅ | ✅ |
| Upload Promotional | ❌ | ✅ |
| Get File Details | ✅ | ✅ |
| List Files | ❌ | ✅ |
| Delete File | ❌ | ✅ |

---

## 🧪 Testing via Swagger UI

1. Open http://localhost:8000/api/docs
2. Navigate to "File Uploads" section
3. Authorize with your JWT token (click "Authorize" button)
4. Try uploading a test image using any endpoint
5. Check the response for the uploaded file URL

---

## 📊 File Organization Best Practices

### Service Images
- Upload high-quality images for each service type
- Use descriptive service names
- Keep images under 5MB for optimal performance

### Vehicle Images
- Upload "before" images when creating a booking
- Upload "during" images while work is in progress
- Upload "after" images when service is complete
- Organize by booking ID for easy retrieval

### Promotional Content
- Use consistent aspect ratios for banners
- Optimize images for web (WebP format recommended)
- Keep videos under 50MB

---

## 🌐 ImageKit Dashboard

Access your ImageKit dashboard to:
- View all uploaded files
- Manage folders and files
- Configure transformations
- Set up CDN rules
- Monitor usage and bandwidth

**Dashboard URL:** https://imagekit.io/dashboard

---

## ✅ Verification

To verify ImageKit is working:

1. **Test Configuration:**
```bash
cd D:\Automex\Backend
.\.venv\Scripts\python.exe -c "from automex_backend.services.imagekit_service import imagekit_service; print('✅ ImageKit configured successfully!')"
```

2. **Upload a Test Image via API:**
   - Open http://localhost:8000/api/docs
   - Login as admin
   - Use `POST /api/v1/uploads/promotional` to upload a test image
   - Check the returned URL - it should start with `https://ik.imagekit.io/xo3judaw9/Automex/`

3. **Check ImageKit Dashboard:**
   - Login to https://imagekit.io
   - Navigate to Media Library
   - Look for the `/Automex` folder
   - Your uploaded files should be there

---

## 🐛 Troubleshooting

### Error: "ImageKit credentials not configured"
- Check that `.env` file has all three ImageKit variables set
- Restart the server after updating `.env`

### Error: "Upload failed"
- Verify your ImageKit account is active
- Check file size (max 25MB for free plan)
- Ensure file type is supported

### Error: "403 Forbidden"
- Only admin users can upload service and promotional images
- Regular users can only upload vehicle images for their own bookings

---

**ImageKit integration is now fully configured and ready to use! 🎉**

