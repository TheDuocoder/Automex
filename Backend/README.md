# AutoMex Backend API

Premium Car Service & Maintenance Platform - FastAPI Backend

## 🚀 Features

- **FastAPI Framework**: Modern, fast, and highly performant web framework
- **Async/Await**: Fully asynchronous database operations using SQLAlchemy 2.0
- **Authentication**: Secure user authentication using FastAPI Users with JWT tokens
- **Database**: SQLite with async support (easily upgradable to PostgreSQL)
- **API Documentation**: Auto-generated interactive API docs (Swagger UI & ReDoc)
- **Type Safety**: Full type hints throughout the codebase
- **Pydantic Validation**: Request/response validation using Pydantic models
- **ImageKit Integration**: Ready for image upload and management
- **CORS Support**: Configured for frontend integration

## 📋 Prerequisites

- Python 3.14 or higher
- UV package manager (installed automatically with this project)

## 🛠️ Installation

### 1. Clone the repository

```bash
cd Backend
```

### 2. Create and configure environment variables

```bash
cp .env.example .env
```

Edit `.env` file and update the following:
- `SECRET_KEY`: Generate a secure secret key
- `IMAGEKIT_*`: Add your ImageKit credentials (optional for now)
- `CORS_ORIGINS`: Add your frontend URL

### 3. Install dependencies

Dependencies are already installed via UV. If you need to reinstall:

```bash
uv sync
```

## 🎯 Running the Application

### Development Mode

```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Run the development server
python -m automex_backend.main
```

Or using UV directly:

```bash
uv run python -m automex_backend.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs (Swagger)**: http://localhost:8000/api/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/api/redoc
- **OpenAPI Schema**: http://localhost:8000/api/openapi.json

### Production Mode

```bash
uvicorn automex_backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/jwt/login` - Login and get JWT token
- `POST /api/v1/auth/jwt/logout` - Logout
- `GET /api/v1/auth/me` - Get current user info
- `PATCH /api/v1/auth/users/me` - Update current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Services (`/api/v1/services`)

- `GET /api/v1/services` - Get all services (with filters)
- `GET /api/v1/services/{id}` - Get service by ID
- `POST /api/v1/services` - Create service (admin only)
- `PUT /api/v1/services/{id}` - Update service (admin only)
- `DELETE /api/v1/services/{id}` - Delete service (admin only)

### Bookings (`/api/v1/bookings`)

- `GET /api/v1/bookings` - Get user's bookings
- `GET /api/v1/bookings/{id}` - Get booking by ID
- `POST /api/v1/bookings` - Create new booking
- `PUT /api/v1/bookings/{id}` - Update booking
- `DELETE /api/v1/bookings/{id}` - Cancel booking

## 🗄️ Database Models

### User
- Email, password (hashed)
- Full name, phone number
- Role (user/superuser)
- Timestamps

### Service
- Name, description
- Category (general_service, ac_service, battery, etc.)
- Pricing (base_price, discounted_price)
- Duration, availability
- Image URL

### Booking
- User and Service references
- Booking date and status
- Vehicle details (make, model, year, registration)
- Contact information
- Pickup address
- Cost tracking (estimated/actual)
- Technician notes
- Timestamps

## 🔐 Authentication Flow

1. **Register**: `POST /api/v1/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword",
     "full_name": "John Doe",
     "phone_number": "+919876543210"
   }
   ```

2. **Login**: `POST /api/v1/auth/jwt/login`
   ```json
   {
     "username": "user@example.com",
     "password": "securepassword"
   }
   ```
   Response:
   ```json
   {
     "access_token": "eyJ0eXAiOiJKV1QiLCJhbG...",
     "token_type": "bearer"
   }
   ```

3. **Use Token**: Add to request headers
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbG...
   ```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User"
  }'

# Get services
curl http://localhost:8000/api/v1/services
```

### Using Swagger UI

Navigate to http://localhost:8000/api/docs and test all endpoints interactively!

## 📦 Project Structure

```
Backend/
├── src/
│   └── automex_backend/
│       ├── __init__.py          # Package initialization
│       ├── main.py              # FastAPI application entry point
│       ├── config.py            # Configuration settings
│       ├── database.py          # Database setup and session
│       ├── models/              # SQLAlchemy models
│       │   ├── __init__.py
│       │   ├── user.py          # User model
│       │   ├── service.py       # Service model
│       │   └── booking.py       # Booking model
│       ├── schemas/             # Pydantic schemas
│       │   ├── __init__.py
│       │   ├── user.py
│       │   ├── service.py
│       │   └── booking.py
│       └── api/                 # API routes
│           ├── __init__.py
│           ├── auth.py          # Authentication routes
│           ├── services.py      # Service routes
│           └── bookings.py      # Booking routes
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment file
├── .gitignore                   # Git ignore rules
├── pyproject.toml               # Project configuration
├── README.md                    # This file
└── uv.lock                      # UV lock file
```

## 🔧 Configuration

All configuration is managed through environment variables in `.env` file:

- **Application**: DEBUG, HOST, PORT
- **Database**: DATABASE_URL
- **Security**: SECRET_KEY, token expiration times
- **CORS**: CORS_ORIGINS
- **ImageKit**: API credentials for image management
- **Email**: SMTP configuration (for future features)

## 🚀 Deployment

### Using Docker (Recommended)

```dockerfile
FROM python:3.14-slim

WORKDIR /app

# Install UV
RUN pip install uv

# Copy project files
COPY . .

# Install dependencies
RUN uv sync --frozen

# Run the application
CMD ["uv", "run", "python", "-m", "automex_backend.main"]
```

### Using Gunicorn + Uvicorn Workers

```bash
gunicorn automex_backend.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

## 📝 Development Notes

### Creating a Superuser

Currently, you need to manually update the database to create a superuser:

```python
# In Python shell
from automex_backend.models.user import User
from automex_backend.database import async_session_maker
import asyncio

async def create_superuser():
    async with async_session_maker() as session:
        # Get user and update
        result = await session.execute(
            select(User).where(User.email == "admin@automex.in")
        )
        user = result.scalar_one()
        user.is_superuser = True
        await session.commit()

asyncio.run(create_superuser())
```

### Adding New Models

1. Create model in `src/automex_backend/models/`
2. Create schema in `src/automex_backend/schemas/`
3. Create API routes in `src/automex_backend/api/`
4. Import in respective `__init__.py` files
5. Restart the server to apply changes

## 🤝 Integration with Frontend

The backend is configured to work with your React frontend:

1. Update `CORS_ORIGINS` in `.env` with your frontend URL
2. Use the JWT token in Authorization header for protected routes
3. API base URL: `http://localhost:8000/api/v1`

### Example Frontend Integration

```typescript
// Login
const response = await fetch('http://localhost:8000/api/v1/auth/jwt/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    username: 'user@example.com',
    password: 'password123'
  })
});
const { access_token } = await response.json();

// Use token
const services = await fetch('http://localhost:8000/api/v1/services', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

## 📄 License

This project is part of AutoMex - Premium Car Service & Maintenance Platform.

## 🐛 Troubleshooting

### Database Issues
- Delete `automex.db` and restart the server to recreate tables

### Import Errors
- Ensure virtual environment is activated
- Run `uv sync` to reinstall dependencies

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 8000

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for AutoMex Platform**

