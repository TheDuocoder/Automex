# ✅ Google Drive .env Auto-Sync - Setup Complete!

## 🎉 What's Been Configured

Your AutoMex backend is now configured to automatically download the `.env` file from Google Drive before starting!

---

## 📦 What Was Created

### 1. **Google Drive Service** (`services/gdrive_config.py`)
- Downloads `.env` from Google Drive using file ID
- Automatic fallback to local file if download fails
- Simple URL-based download (no OAuth required)

### 2. **Setup Wizard** (`setup_gdrive.py`)
- Interactive helper to extract file ID
- Test download functionality
- Generate environment variable commands

### 3. **Documentation**
- **`GDRIVE_ENV_SETUP.md`** - Complete setup guide (25+ pages)
- **`GDRIVE_QUICK_START.txt`** - Quick reference card
- **`SETUP_COMPLETE.md`** - This file

### 4. **Modified Files**
- **`main.py`** - Calls Google Drive sync before app starts
- **`imagekit_service.py`** - Lazy loading to prevent initialization errors

---

## 🚀 What You Need To Do Now

### Step 1: Upload .env to Google Drive

1. Login to [Google Drive](https://drive.google.com)
   - **Email**: techduocoders@gmail.com
   - **Password**: Procoder@2025

2. Upload your `.env` file to Google Drive
   - You can create a folder named "AutoMex Config" for organization
   - Upload your complete `.env` file there

### Step 2: Share the File

1. Right-click on the `.env` file
2. Click **"Share"** or **"Get link"**
3. Change to: **"Anyone with the link"** → **"Viewer"**
4. Click **"Copy link"**

Example link:
```
https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing
```

### Step 3: Extract File ID

From your link, copy the part between `/d/` and `/view`:

```
https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing
                                ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                            THIS IS YOUR FILE_ID
```

### Step 4: Set Environment Variable

**Windows PowerShell:**
```powershell
# Replace YOUR_FILE_ID with your actual file ID
$env:GDRIVE_ENV_FILE_ID="YOUR_FILE_ID"

# OR make it permanent (requires restart)
[System.Environment]::SetEnvironmentVariable('GDRIVE_ENV_FILE_ID', 'YOUR_FILE_ID', 'User')
```

**Linux/Mac:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export GDRIVE_ENV_FILE_ID="YOUR_FILE_ID"
```

### Step 5: Test the Setup

Run the interactive setup wizard:
```bash
cd D:\Automex\Backend
python setup_gdrive.py
```

This will:
- Help you extract the file ID
- Test the download
- Show you the commands to run

### Step 6: Start the Backend

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
🚀 Database initialized successfully
```

---

## 🔄 How It Works

### On Every Backend Startup:

1. **Check for File ID**: Looks for `GDRIVE_ENV_FILE_ID` environment variable
2. **Download if Configured**: If found, downloads `.env` from Google Drive
3. **Fallback**: If download fails, uses existing local `.env` file
4. **Continue**: Backend starts normally with the loaded configuration

### Sequence Diagram:

```
Backend Startup
     ↓
Check GDRIVE_ENV_FILE_ID
     ↓
[If Set] → Download from Google Drive → Success? → Load .env
     ↓                                       ↓
[If Not Set] ←――――――――――――――――――――――――――― Fail
     ↓
Use Local .env
     ↓
Start FastAPI App
```

---

## 📝 Current .env Template

Here's what should be in your Google Drive `.env` file:

```env
# Application Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=sqlite+aiosqlite:///./automex.db

# Security - CHANGE IN PRODUCTION!
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=public_lVFHk5WRbmDAfmuhdoa80cTEtRw=
IMAGEKIT_PRIVATE_KEY=private_3kBJMEY/pUeydmiHA783IZ+7PAc=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xo3judaw9

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Google Drive Sync Control (Optional)
SYNC_ENV_FROM_GDRIVE=true
```

---

## ✅ Verification Checklist

Before starting the backend, verify:

- [ ] `.env` file uploaded to Google Drive
- [ ] File shared with "Anyone with the link can view"
- [ ] File ID extracted from share link
- [ ] `GDRIVE_ENV_FILE_ID` environment variable set
- [ ] Tested with `python setup_gdrive.py`
- [ ] Backend starts without errors
- [ ] See "✅ .env file downloaded" message

---

## 🛠️ Troubleshooting

### Problem: "GDRIVE_ENV_FILE_ID not configured"

**Solution:**
```powershell
# Check if it's set
$env:GDRIVE_ENV_FILE_ID

# If empty, set it
$env:GDRIVE_ENV_FILE_ID="YOUR_FILE_ID"
```

### Problem: "Failed to download file. Status code: 404"

**Causes:**
- File ID is incorrect
- File is not shared publicly
- File was deleted from Google Drive

**Solution:**
- Double-check the file ID
- Ensure sharing is set to "Anyone with link"
- Verify file exists in Google Drive

### Problem: Backend starts but doesn't download

**Possible Causes:**
- `SYNC_ENV_FROM_GDRIVE` set to "false"
- `GDRIVE_ENV_FILE_ID` not set
- Using local .env as fallback

**Solution:**
- Check environment variables
- Look for warning messages in startup logs

### Problem: Downloaded file is empty or HTML

**Cause:**
- Google Drive returned an error page
- File requires additional permissions

**Solution:**
- Make sure file is shared correctly
- Try re-uploading the file
- Check if file is too large (Google Drive limits)

---

## 🔒 Security Best Practices

### ⚠️ Important Security Notes:

1. **Never commit .env to Git**
   - Already in `.gitignore`
   - Contains sensitive credentials

2. **Google Drive Link is Public**
   - Anyone with the link can view your `.env`
   - Regularly rotate your credentials
   - Consider using Google Workspace for better access control

3. **Production Recommendations**:
   - Use **Google Cloud Secret Manager**
   - Use **AWS Systems Manager Parameter Store**
   - Use **Azure Key Vault**
   - Use **HashiCorp Vault**
   - Or use environment variables directly in your hosting platform

4. **Team Access**:
   - Use Google Workspace for team-wide access
   - Set up proper access controls
   - Log who accesses the file

---

## 📊 Benefits of This Setup

✅ **Team Consistency** - Everyone uses the same configuration
✅ **Easy Updates** - Update .env once, everyone gets it
✅ **CI/CD Ready** - Automatically pulls config in deployments
✅ **Backup** - Configuration backed up to Google Drive
✅ **No Git Commits** - Sensitive data never in version control
✅ **Fallback** - Uses local file if download fails

---

## 🎯 Alternative: Disable Google Drive Sync

If you don't want to use Google Drive sync:

**Option 1: Don't set the environment variable**
- Just don't set `GDRIVE_ENV_FILE_ID`
- Backend will use local `.env` file

**Option 2: Explicitly disable**
```powershell
$env:SYNC_ENV_FROM_GDRIVE="false"
```

**Option 3: Remove from code**
- Comment out the `setup_env_from_gdrive()` call in `main.py`

---

## 📚 Additional Resources

- **Full Documentation**: `GDRIVE_ENV_SETUP.md`
- **Quick Reference**: `GDRIVE_QUICK_START.txt`
- **Setup Wizard**: `python setup_gdrive.py`
- **Test Download**: 
  ```bash
  python -c "from automex_backend.services.gdrive_config import setup_env_from_gdrive; setup_env_from_gdrive()"
  ```

---

## 💡 Pro Tips

1. **Use Different Files for Different Environments**:
   - `.env.development` → Development
   - `.env.staging` → Staging
   - `.env.production` → Production
   - Set different `GDRIVE_ENV_FILE_ID` for each

2. **Version Your .env**:
   - Add date to filename: `.env.2025-11-01`
   - Keep history of configurations

3. **Monitor Downloads**:
   - Check startup logs to ensure download succeeded
   - Set up alerts if download fails

4. **Regular Updates**:
   - Update Google Drive file when config changes
   - Backend will use new config on next restart

---

## 🎉 You're All Set!

The backend is now configured for automatic `.env` sync from Google Drive!

**Next Steps:**
1. Follow Steps 1-6 above to complete the setup
2. Test with `python setup_gdrive.py`
3. Start the backend and verify the download message
4. Enjoy automatic configuration management!

---

**Need Help?**
- See `GDRIVE_ENV_SETUP.md` for detailed troubleshooting
- Run `python setup_gdrive.py` for interactive setup
- Check console output for specific error messages

**Happy Coding! 🚀**

