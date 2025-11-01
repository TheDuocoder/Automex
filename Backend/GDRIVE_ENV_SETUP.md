# Google Drive .env Configuration Setup

## 📋 Overview

The AutoMex backend can automatically download the `.env` file from Google Drive before starting. This ensures all team members and deployments use the same configuration.

---

## 🔧 Setup Instructions

### Step 1: Upload .env to Google Drive

1. Go to [Google Drive](https://drive.google.com) and login with: **techduocoders@gmail.com**
2. Navigate to the folder where you want to store the .env file (or create a new folder)
3. Upload your `.env` file to Google Drive
4. Make sure the file is named exactly `.env`

### Step 2: Share the File

1. Right-click on the `.env` file in Google Drive
2. Click **"Share"** or **"Get link"**
3. Change access to **"Anyone with the link"** can **"Viewer"**
4. Click **"Copy link"**

The link will look like:
```
https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing
```

### Step 3: Extract File ID

From the link above, extract the **FILE_ID** (the part between `/d/` and `/view`)

Example:
- **Link**: `https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing`
- **File ID**: `1ABC123xyz456DEF789`

### Step 4: Configure the Backend

**Option A: Using System Environment Variable (Recommended)**

Create a system environment variable before running the backend:

**Windows:**
```powershell
# Temporary (current session only)
$env:GDRIVE_ENV_FILE_ID="YOUR_FILE_ID_HERE"

# Permanent (requires restart)
[System.Environment]::SetEnvironmentVariable('GDRIVE_ENV_FILE_ID', 'YOUR_FILE_ID_HERE', 'User')
```

**Linux/Mac:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export GDRIVE_ENV_FILE_ID="YOUR_FILE_ID_HERE"
```

**Option B: Update the Code Directly**

Edit `Backend/src/automex_backend/services/gdrive_config.py`:

```python
# Line 20: Update this line
GDRIVE_ENV_FILE_ID = os.getenv("GDRIVE_ENV_FILE_ID", "YOUR_FILE_ID_HERE")
```

**Option C: Create a Local Config File (Not Recommended)**

Create `Backend/gdrive_config.env`:
```env
GDRIVE_ENV_FILE_ID=YOUR_FILE_ID_HERE
```

---

## 🚀 How It Works

1. **On Backend Startup**: The system checks for `GDRIVE_ENV_FILE_ID`
2. **If Configured**: Downloads `.env` from Google Drive
3. **If Not Configured**: Uses existing local `.env` file
4. **If Download Fails**: Falls back to local `.env` file

---

## 📝 Example Complete Setup

### 1. Your .env file in Google Drive

Create/Update `.env` with all your credentials:

```env
# Application
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=sqlite+aiosqlite:///./automex.db

# Security
SECRET_KEY=your-super-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_lVFHk5WRbmDAfmuhdoa80cTEtRw=
IMAGEKIT_PRIVATE_KEY=private_3kBJMEY/pUeydmiHA783IZ+7PAc=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xo3judaw9

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Google Drive Sync (Optional)
SYNC_ENV_FROM_GDRIVE=true
```

### 2. Share and Get File ID

Follow Steps 1-3 above to get your FILE_ID

### 3. Set Environment Variable

```powershell
# Windows PowerShell
$env:GDRIVE_ENV_FILE_ID="YOUR_ACTUAL_FILE_ID"
```

### 4. Start Backend

```bash
cd D:\Automex\Backend
python -m automex_backend.main
```

You should see:
```
============================================================
🚀 Starting AutoMex Backend...
============================================================
🔄 Attempting to sync .env file from Google Drive...
🔄 Downloading .env file from Google Drive...
✅ .env file downloaded successfully from Google Drive
   Location: D:\Automex\Backend\.env
```

---

## 🔒 Security Considerations

### ⚠️ Important Security Notes:

1. **Never commit .env to Git**
   - ✅ Already in `.gitignore`
   - Contains sensitive credentials

2. **Google Drive Link Security**
   - Anyone with the link can view the file
   - Consider using Google Workspace with restricted sharing
   - Regularly rotate your credentials

3. **Better Alternatives for Production**:
   - Use **Google Cloud Secret Manager**
   - Use **AWS Systems Manager Parameter Store**
   - Use **Azure Key Vault**
   - Use **HashiCorp Vault**

---

## 🧪 Testing the Setup

### Test 1: Check if File ID is Configured

```bash
cd D:\Automex\Backend
.\.venv\Scripts\python.exe -c "import os; print('File ID:', os.getenv('GDRIVE_ENV_FILE_ID', 'NOT SET'))"
```

### Test 2: Test Download

```bash
cd D:\Automex\Backend
.\.venv\Scripts\python.exe -c "from automex_backend.services.gdrive_config import setup_env_from_gdrive; setup_env_from_gdrive()"
```

Expected output:
```
🔄 Attempting to sync .env file from Google Drive...
🔄 Downloading .env file from Google Drive...
✅ .env file downloaded successfully from Google Drive
   Location: D:\Automex\Backend\.env
```

### Test 3: Verify Downloaded File

```bash
cd D:\Automex\Backend
Get-Content .env | Select-Object -First 5
```

---

## 🛠️ Troubleshooting

### Problem: "GDRIVE_ENV_FILE_ID not configured"

**Solution:**
- Set the `GDRIVE_ENV_FILE_ID` environment variable
- Make sure you restart your terminal/IDE after setting it

### Problem: "Failed to download file. Status code: 404"

**Solution:**
- Verify the file ID is correct
- Make sure the file is shared as "Anyone with the link can view"
- Check that the file exists in Google Drive

### Problem: "Using existing .env file if available"

**Meaning:**
- The system couldn't download from Google Drive
- It will use your local `.env` file instead
- This is normal if Google Drive sync is not configured

### Problem: File downloads but is empty or HTML

**Solution:**
- The file might require confirmation (large files)
- Try downloading the file manually and check the link
- Make sure sharing permissions are set correctly

---

## 🔄 Disabling Google Drive Sync

If you want to disable automatic sync from Google Drive:

**Option 1: Remove Environment Variable**
```powershell
Remove-Item Env:\GDRIVE_ENV_FILE_ID
```

**Option 2: Set Disable Flag**
```powershell
$env:SYNC_ENV_FROM_GDRIVE="false"
```

---

## 📊 Deployment Scenarios

### Development (Local)
- Use local `.env` file
- Optionally sync from Google Drive for team consistency

### Staging/Testing
- Set `GDRIVE_ENV_FILE_ID` in CI/CD environment variables
- Automatically downloads latest config on deployment

### Production
- **Recommended**: Use proper secret management service
- **Alternative**: Use Google Drive with restricted access
- Always use different `.env` files for prod/staging

---

## 💡 Advanced: Multiple Environment Files

You can maintain different `.env` files for different environments:

1. **Upload multiple files to Google Drive**:
   - `.env.development`
   - `.env.staging`
   - `.env.production`

2. **Get file IDs for each**

3. **Set environment-specific variables**:
   ```bash
   # Development
   export GDRIVE_ENV_FILE_ID="dev_file_id_here"
   
   # Production
   export GDRIVE_ENV_FILE_ID="prod_file_id_here"
   ```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Google Drive sharing permissions
3. Test with a simple text file first
4. Check console output for specific error messages

---

## ✅ Quick Checklist

- [ ] Upload `.env` to Google Drive
- [ ] Share file with "Anyone with the link can view"
- [ ] Extract FILE_ID from share link
- [ ] Set `GDRIVE_ENV_FILE_ID` environment variable
- [ ] Test download with test script
- [ ] Start backend and verify sync message
- [ ] Confirm `.env` file exists locally

---

**Your .env file will now be automatically synced from Google Drive on every backend startup! 🎉**

