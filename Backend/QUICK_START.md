# 🚀 Quick Start Guide - AutoMex Backend

## Step 1: Create Environment File

```bash
# Copy the example environment file
copy .env.example .env
```

## Step 2: Run the Server

```bash
# Option 1: Using Python module
python -m automex_backend.main

# Option 2: Using the run script
python run.py

# Option 3: Using UV
uv run python -m automex_backend.main
```

## Step 3: Access the API

- **API Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health

## 🧪 Test the API

### 1. Check Health
```bash
curl http://localhost:8000/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@automex.in\",\"password\":\"testpass123\",\"full_name\":\"Test User\"}"
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/jwt/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@automex.in&password=testpass123"
```

### 4. Get Services (No Auth Required)
```bash
curl http://localhost:8000/api/v1/services
```

## 📁 Project Structure Created

```
Backend/
├── src/automex_backend/
│   ├── main.py              ← FastAPI app entry point
│   ├── config.py            ← Configuration settings
│   ├── database.py          ← Database setup
│   ├── models/              ← SQLAlchemy models
│   │   ├── user.py          ← User model (auth)
│   │   ├── service.py       ← Service model
│   │   └── booking.py       ← Booking model
│   ├── schemas/             ← Pydantic schemas
│   │   ├── user.py
│   │   ├── service.py
│   │   └── booking.py
│   └── api/                 ← API routes
│       ├── auth.py          ← Authentication endpoints
│       ├── services.py      ← Service CRUD
│       └── bookings.py      ← Booking management
├── .env.example             ← Environment template
├── .gitignore              ← Git ignore rules
├── README.md               ← Full documentation
├── QUICK_START.md          ← This file
├── run.py                  ← Quick start script
└── pyproject.toml          ← Project config

Database: automex.db (created automatically)
```

## 📦 Installed Packages

✅ FastAPI >= 0.118.0
✅ FastAPI Users (with SQLAlchemy)
✅ Uvicorn (with standard extras)
✅ aiosqlite >= 0.21.0
✅ ImageKit IO >= 4.2.0
✅ Python Dotenv >= 1.1.1
✅ Pydantic Settings

## 🎯 Available API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register new user
- POST `/api/v1/auth/jwt/login` - Login
- POST `/api/v1/auth/jwt/logout` - Logout
- GET `/api/v1/auth/me` - Get current user

### Services
- GET `/api/v1/services` - List all services
- GET `/api/v1/services/{id}` - Get service details
- POST `/api/v1/services` - Create service (admin)
- PUT `/api/v1/services/{id}` - Update service (admin)
- DELETE `/api/v1/services/{id}` - Delete service (admin)

### Bookings
- GET `/api/v1/bookings` - List user bookings
- GET `/api/v1/bookings/{id}` - Get booking details
- POST `/api/v1/bookings` - Create booking
- PUT `/api/v1/bookings/{id}` - Update booking
- DELETE `/api/v1/bookings/{id}` - Cancel booking

## 🔗 Frontend Integration

Add to your React frontend:

```typescript
const API_BASE_URL = "http://localhost:8000/api/v1";

// Login
const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// Fetch with auth
const fetchWithAuth = async (url: string) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

## ⚠️ Important Notes

1. **Change SECRET_KEY** in .env before production
2. **Database** is created automatically on first run
3. **CORS** is configured for localhost:5173 and localhost:3000
4. **StreamLit** was skipped due to build issues (not needed for FastAPI)

## 🐛 Troubleshooting

### "Module not found" error
```bash
cd Backend
.venv\Scripts\activate  # Activate virtual environment
python -m automex_backend.main
```

### Port 8000 already in use
Change PORT in .env file or kill existing process

### Database errors
Delete automex.db and restart server

## 📞 Need Help?

- Check full documentation in README.md
- Visit API docs at http://localhost:8000/api/docs
- All endpoints have interactive testing available

---

**Happy Coding! 🚀**

