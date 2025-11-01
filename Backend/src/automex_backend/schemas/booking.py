"""
Booking schemas for API validation
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from automex_backend.models.booking import BookingStatus


class BookingBase(BaseModel):
    """Base booking schema"""
    service_id: int
    booking_date: datetime
    vehicle_make: str = Field(..., min_length=1, max_length=100)
    vehicle_model: str = Field(..., min_length=1, max_length=100)
    vehicle_year: int = Field(..., ge=1900, le=2100)
    vehicle_registration: str = Field(..., min_length=1, max_length=50)
    contact_name: str = Field(..., min_length=1, max_length=255)
    contact_phone: str = Field(..., pattern=r"^\+?[1-9]\d{1,14}$")
    pickup_address: str = Field(..., min_length=10)
    special_instructions: Optional[str] = None


class BookingCreate(BookingBase):
    """Schema for creating a new booking"""
    pass


class BookingUpdate(BaseModel):
    """Schema for updating a booking"""
    booking_date: Optional[datetime] = None
    status: Optional[BookingStatus] = None
    vehicle_make: Optional[str] = Field(None, min_length=1, max_length=100)
    vehicle_model: Optional[str] = Field(None, min_length=1, max_length=100)
    vehicle_year: Optional[int] = Field(None, ge=1900, le=2100)
    vehicle_registration: Optional[str] = Field(None, min_length=1, max_length=50)
    contact_name: Optional[str] = Field(None, min_length=1, max_length=255)
    contact_phone: Optional[str] = Field(None, pattern=r"^\+?[1-9]\d{1,14}$")
    pickup_address: Optional[str] = Field(None, min_length=10)
    special_instructions: Optional[str] = None
    estimated_cost: Optional[float] = Field(None, gt=0)
    actual_cost: Optional[float] = Field(None, gt=0)
    technician_notes: Optional[str] = None


class BookingRead(BookingBase):
    """Schema for reading booking data"""
    id: int
    user_id: int
    status: BookingStatus
    estimated_cost: Optional[float] = None
    actual_cost: Optional[float] = None
    technician_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

