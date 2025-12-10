"""
Main FastAPI application entry point for AutoMex Backend
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from contextlib import asynccontextmanager
import os
from pathlib import Path
from dotenv import load_dotenv

# Print startup message
print("\n" + "="*60)
print("Starting AutoMex Backend...")
print("="*60)

# Smart .env loading with Google Drive fallback
def load_env_with_fallback():
    """
    Load .env file with automatic Google Drive fallback
    
    Logic:
    1. Try to load local .env file
    2. If it doesn't exist or is empty, download from Google Drive
    3. Try loading again after download
    """
    env_path = Path(__file__).parent.parent.parent / ".env"
    
    # Check if .env exists and is not empty
    if env_path.exists() and env_path.stat().st_size > 0:
        print("[INFO] Loading local .env file...")
        load_dotenv()
        print("[SUCCESS] Local .env file loaded successfully")
        return True
    
    # .env is missing or empty - try Google Drive
    print("[WARNING] Local .env file not found or is empty")
    print("[INFO] Attempting to download from Google Drive...")
    
    try:
        from automex_backend.services.gdrive_config import setup_env_from_gdrive
        
        success = setup_env_from_gdrive()
        
        if success:
            # Try loading again after download
            load_dotenv()
            print("[SUCCESS] .env file loaded from Google Drive")
            return True
        else:
            print("[WARNING] Could not download .env from Google Drive")
            # Try loading anyway in case there's a local file
            load_dotenv()
            return False
    
    except Exception as e:
        print(f"[ERROR] Error during Google Drive sync: {e}")
        # Try loading local file anyway
        load_dotenv()
        return False

# Load environment variables with smart fallback
load_env_with_fallback()

from automex_backend.config import settings
from automex_backend.database import init_db
from automex_backend.api import api_router


# Custom CORS Middleware - Manually add headers to EVERY response
class CORSHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Handle preflight OPTIONS request
        if request.method == "OPTIONS":
            response = Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Max-Age": "3600",
                }
            )
            return response
        
        # For all other requests, process and add CORS headers
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Max-Age"] = "3600"
        
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application
    Handles startup and shutdown events
    """
    # Startup: Initialize database
    await init_db()
    print("Database initialized successfully")
    
    yield
    
    # Shutdown: Cleanup
    print("Shutting down AutoMex Backend...")


# Create FastAPI application
app = FastAPI(
    title="AutoMex API",
    description="""
    Premium Car Service & Maintenance Platform API
    
    ## Features
    - **Authentication**: JWT-based authentication
    - **Services**: Manage car services (AC repair, car spa, etc.)
    - **Bookings**: Create and manage service bookings
    - **Roles**: User role management
    - **File Uploads**: Image and file upload management
    
    ## Authentication
    1. Use `POST /api/v1/auth/login` with email and password to get a JWT token
    2. Click "Authorize" button and paste your token (Bearer authentication)
    3. All endpoints will be available for testing
    
    **Note**: All endpoints are visible in Swagger UI regardless of authentication status.
    Authentication is only required to successfully CALL protected endpoints.
    """,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)


# Configure OpenAPI schema for Bearer token authentication in Swagger UI
def custom_openapi():
    """Custom OpenAPI schema with Bearer token authentication"""
    if app.openapi_schema:
        return app.openapi_schema
    
    from fastapi.openapi.utils import get_openapi
    
    # Get all routes - this includes all registered endpoints
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        servers=[
            {"url": "http://localhost:8000", "description": "Development server"},
        ],
    )
    
    # Ensure components exist
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}
    
    # Add Bearer token security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "Bearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter JWT token (get it from /api/v1/auth/login endpoint). Paste your token here (without 'Bearer' prefix, just the token)."
        },
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/api/v1/auth/jwt/login",
                    "scopes": {}
                }
            },
            "description": "OAuth2 password flow for authentication"
        }
    }
    
    # Ensure all paths are visible - don't filter anything
    # Count paths for debugging
    path_count = len(openapi_schema.get("paths", {}))
    print(f"\n[INFO] OpenAPI schema generated with {path_count} endpoint paths\n")
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

# Add Custom CORS Middleware - This will add headers to EVERY response
print("[INFO] CORS: Using custom middleware - ALL origins (*)")
app.add_middleware(CORSHeaderMiddleware)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Mount static files for local uploads (fallback when S3 is not configured)
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
try:
    app.mount("/static", StaticFiles(directory="uploads"), name="static")
    print("[INFO] Static file serving enabled for local uploads")
except Exception as e:
    print(f"[WARNING] Could not mount static files: {str(e)}")

# Debug: Print all registered routes
print("\n[INFO] Registered API Routes:")
for route in app.routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        methods = ', '.join(sorted(route.methods)) if route.methods else 'N/A'
        print(f"  {methods:20s} {route.path}")
print(f"\n[INFO] Total routes registered: {len([r for r in app.routes if hasattr(r, 'path')])}\n")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AutoMex API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AutoMex Backend"
    }


@app.get("/test-db")
async def test_database():
    """Test database connectivity"""
    try:
        from automex_backend.database import engine
        from sqlalchemy import text
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            return {"status": "database_connected", "test": "passed"}
    except Exception as e:
        return {"status": "database_error", "error": str(e)}


def main():
    """Main entry point for running the application"""
    import uvicorn
    
    uvicorn.run(
        "automex_backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )


if __name__ == "__main__":
    main()

