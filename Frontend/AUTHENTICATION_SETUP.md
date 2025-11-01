# 🔐 Authentication Integration - AutoMex

## Overview

Complete authentication system integrated between Frontend (React) and Backend (FastAPI).

---

## ✅ What's Been Implemented

### **Backend APIs** (FastAPI)
- ✅ User Registration (`POST /api/v1/auth/register`)
- ✅ User Login (`POST /api/v1/auth/jwt/login`)
- ✅ User Logout (`POST /api/v1/auth/jwt/logout`)
- ✅ Get Current User (`GET /api/v1/auth/me`)
- ✅ JWT Authentication with Bearer Token
- ✅ Password Reset (endpoints available)
- ✅ Email Verification (endpoints available)

### **Frontend Integration** (React + TypeScript)
- ✅ API Service Layer (`src/services/api.ts`)
- ✅ Auth Service (`src/services/authService.ts`)
- ✅ Auth Context (`src/contexts/AuthContext.tsx`)
- ✅ Login Component (fully integrated)
- ✅ Register Component (fully integrated)
- ✅ Form Validation
- ✅ Error Handling
- ✅ Loading States
- ✅ Toast Notifications
- ✅ Token Management (localStorage)

---

## 📂 File Structure

```
Frontend/
├── src/
│   ├── services/
│   │   ├── api.ts                    # API base configuration
│   │   └── authService.ts            # Authentication API calls
│   ├── contexts/
│   │   └── AuthContext.tsx           # Auth state management
│   └── components/
│       ├── Login.tsx                 # Login form (integrated)
│       └── Register.tsx              # Registration form (integrated)

Backend/
└── src/automex_backend/
    ├── api/
    │   └── auth.py                   # Auth endpoints (FastAPI Users)
    ├── models/
    │   └── user.py                   # User database model
    ├── schemas/
    │   └── user.py                   # User validation schemas
    └── config.py                     # CORS configuration
```

---

## 🚀 How to Use

### **1. For Users (Frontend)**

#### **Registration:**
1. Click "Login" button in header
2. Click "Register here"
3. Fill in the form:
   - Full Name
   - Email
   - Phone Number
   - Password (min 8 characters)
   - Confirm Password
   - Accept Terms & Conditions
4. Click "Create Account"
5. Success → Redirects to Login

#### **Login:**
1. Click "Login" button in header
2. Enter Email and Password
3. Click "Log In"
4. Success → User authenticated, token stored

### **2. For Developers**

#### **Using Auth Context:**

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.full_name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <div>Please log in</div>;
}
```

#### **Making Authenticated API Calls:**

```typescript
import { apiCall, getAuthHeader } from '@/services/api';

async function getProtectedData() {
  const response = await apiCall('/api/v1/some-endpoint', {
    method: 'GET',
    headers: getAuthHeader(), // Adds Bearer token
  });

  return response.data;
}
```

---

## 🔌 API Endpoints

### **Base URL:** `http://localhost:8000`

### **Registration**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe",
  "phone_number": "+1234567890"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "is_active": true,
  "is_verified": false,
  "roles": ["user"]
}
```

### **Login**
```http
POST /api/v1/auth/jwt/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=securepassword123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### **Get Current User**
```http
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_verified": false,
  "roles": ["user"]
}
```

### **Logout**
```http
POST /api/v1/auth/jwt/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Configuration

### **Frontend Configuration**

Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

*Default: `http://localhost:8000` (if not set)*

### **Backend Configuration**

The backend already has CORS configured for:
- `http://localhost:5173`
- `http://localhost:8080`
- `http://localhost:8081`
- `http://localhost:8082` (current frontend port)
- All corresponding `127.0.0.1` addresses

---

## 🎨 Features

### **Form Validation**
- ✅ Email format validation
- ✅ Password strength (min 8 characters)
- ✅ Password confirmation matching
- ✅ Required field checking
- ✅ Phone number validation
- ✅ Real-time error messages

### **User Experience**
- ✅ Loading spinners during API calls
- ✅ Success/error toast notifications
- ✅ Form error highlighting
- ✅ Password visibility toggle
- ✅ Auto-redirect after successful registration
- ✅ Remember me checkbox

### **Security**
- ✅ JWT tokens with Bearer authentication
- ✅ Secure token storage (localStorage)
- ✅ Protected routes (ready for implementation)
- ✅ CORS protection
- ✅ Password hashing (backend)

---

## 🧪 Testing the Integration

### **1. Start Both Servers**

**Backend:**
```bash
cd Backend
.\.venv\Scripts\Activate.ps1
uvicorn automex_backend.main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend:**
```bash
cd Frontend
npm run dev
```

### **2. Test Registration**
1. Open http://localhost:8082
2. Click "Login" → "Register here"
3. Fill form with test data
4. Submit → Check for success toast
5. Check backend terminal for confirmation

### **3. Test Login**
1. After registration, click "Login here"
2. Enter registered email and password
3. Submit → Check for success toast
4. Open DevTools → Application → Local Storage
5. Verify `auth_token` is stored

### **4. Test API Documentation**
1. Open http://localhost:8000/api/docs
2. Click "Authorize" button
3. Enter: `Bearer YOUR_TOKEN_HERE`
4. Try calling `/api/v1/auth/me`

---

## 🔐 Token Storage

**Location:** `localStorage.auth_token`

**Format:** JWT Bearer Token

**To Manually Get Token:**
```javascript
// In browser console
localStorage.getItem('auth_token')
```

**To Clear Token:**
```javascript
// In browser console
localStorage.removeItem('auth_token')
```

---

## 🐛 Troubleshooting

### **CORS Error:**
- Ensure backend is running
- Check frontend port matches CORS origins in `Backend/src/automex_backend/config.py`
- Restart backend after CORS changes

### **401 Unauthorized:**
- Token expired (30 min default)
- Token not sent with request
- Invalid token

### **Registration Error:**
- Email already exists
- Password too short
- Missing required fields
- Check backend terminal for details

### **Login Error:**
- Wrong email/password
- User not found
- Check backend database (`automex.db`)

---

## 📊 Database

**Location:** `Backend/automex.db`

**View Users:**
```bash
cd Backend
sqlite3 automex.db
SELECT * FROM user;
```

**Reset Database:**
```bash
cd Backend
rm automex.db
# Restart backend - tables will be recreated
```

---

## 🎯 Next Steps

### **Recommended Enhancements:**

1. **Protected Routes:**
   ```typescript
   // Create ProtectedRoute component
   function ProtectedRoute({ children }) {
     const { isAuthenticated, isLoading } = useAuth();
     
     if (isLoading) return <Loader />;
     if (!isAuthenticated) return <Navigate to="/" />;
     
     return children;
   }
   ```

2. **User Profile Page:**
   - Display user information
   - Edit profile functionality
   - Change password

3. **Google OAuth:**
   - Already has UI button
   - Needs backend OAuth integration

4. **Password Reset:**
   - Email verification
   - Reset token generation

5. **Email Verification:**
   - Send verification email
   - Verify email endpoint

---

## 📞 Support

**Backend API Docs:** http://localhost:8000/api/docs

**Frontend:** http://localhost:8082

**Backend Health:** http://localhost:8000/health

---

## ✅ Integration Status

- ✅ Backend APIs Created
- ✅ Frontend Services Created
- ✅ Auth Context Configured
- ✅ Login Component Integrated
- ✅ Register Component Integrated
- ✅ CORS Configured
- ✅ Token Management Implemented
- ✅ Error Handling Complete
- ✅ Form Validation Working
- ✅ Toast Notifications Active

**Status:** 🎉 **FULLY OPERATIONAL**

---

**Last Updated:** November 1, 2025

