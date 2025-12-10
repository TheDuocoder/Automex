"""
API router configuration
"""
from fastapi import APIRouter
from automex_backend.api import services, bookings, auth, uploads, roles, costs, cars, service_history, pickup_requests, employees, extra_services

api_router = APIRouter()

# Include route modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(roles.router, tags=["Roles"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(costs.router, prefix="/costs", tags=["Costs"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["File Uploads"])
api_router.include_router(cars.router, prefix="/cars", tags=["Cars"])
api_router.include_router(service_history.router, prefix="/service-history", tags=["Service History"])
api_router.include_router(pickup_requests.router, prefix="/pickup-requests", tags=["Pick Up Requests"])
api_router.include_router(employees.router, prefix="/employees", tags=["Employees"])
api_router.include_router(extra_services.router, prefix="/extra-services", tags=["Extra Services"])

