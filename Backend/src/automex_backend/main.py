"""
Main FastAPI application entry point for AutoMex Backend
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

from automex_backend.config import settings
from automex_backend.database import init_db
from automex_backend.api import api_router

# Print startup message
print("\n" + "="*60)
print("Starting AutoMex Backend...")
print("="*60)


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
    description="Premium Car Service & Maintenance Platform API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Add Custom CORS Middleware - This will add headers to EVERY response
print("[INFO] CORS: Using custom middleware - ALL origins (*)")
app.add_middleware(CORSHeaderMiddleware)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


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
        async with engine.connect() as conn:
            result = await conn.execute("SELECT 1")
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

