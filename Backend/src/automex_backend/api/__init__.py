"""
API router configuration
"""
from fastapi import APIRouter
from automex_backend.api import services, bookings, auth, uploads

api_router = APIRouter()

# Include route modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["File Uploads"])

