# 🛑 Stop Automatic API Calls

## Issue
The frontend is making repeated failed API calls to localhost because it's trying to authenticate on page load, but the backend is not running.

## Quick Fix - Clear localStorage

### Option 1: Browser Console (Fastest)
1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Run this command:
```javascript
localStorage.clear()
```
4. Refresh the page (F5)

### Option 2: Application/Storage Tab
1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → **http://localhost:8080**
4. Click **Clear All** or delete the `auth_token` key
5. Refresh the page

### Option 3: Private/Incognito Window
Just open the site in a new private/incognito window (it won't have the old auth token)

## Why This Happens

The `AuthContext` automatically checks if the user is logged in on page load:
- It looks for an `auth_token` in localStorage
- If found, it tries to fetch the current user from the backend
- Since the backend isn't running, the request fails
- But the token remains, so it tries again on every page load/refresh

## Permanent Fix Applied

I've updated `Frontend/src/contexts/AuthContext.tsx` to automatically clear the token if the backend is not available. This means:
- ✅ No more repeated failed calls after the first one
- ✅ Token is cleared automatically when backend is down
- ✅ Clean state when backend comes back online

## How to Start Fresh

1. **Clear localStorage** (see above)
2. **Start the backend:**
   ```powershell
   cd D:\Automex\Backend
   uvicorn automex_backend.main:app --host 0.0.0.0 --port 8000
   ```
3. **Refresh frontend** (should be at http://localhost:8080)
4. **Register/Login** - will work normally now!

## Testing the Fix

After clearing localStorage and restarting:
1. Open http://localhost:8080
2. Check Network tab - should see only 1 failed request (or none if backend is running)
3. Try to register/login - should work if backend is running

---

**TL;DR: Run `localStorage.clear()` in browser console and refresh the page!**

