"""
Booking schemas for API validation
"""
from typing import Optional, List, Union, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from automex_backend.models.booking import BookingStatus


class BookingBase(BaseModel):
    """Base booking schema"""
    service_id: Optional[int] = None
    booking_date: datetime
    vehicle_make: Optional[str] = Field(None, min_length=1, max_length=100)
    vehicle_model: Optional[str] = Field(None, min_length=1, max_length=100)
    vehicle_year: Optional[int] = Field(None, ge=1900, le=2100)
    vehicle_registration: Optional[str] = Field(None, min_length=1, max_length=50)
    contact_name: Optional[str] = Field(None, min_length=1, max_length=255)
    contact_phone: Optional[str] = Field(None, max_length=20)
    pickup_address: Optional[str] = Field(None, min_length=10)
    special_instructions: Optional[str] = None
    # Car selection details from Zustand store
    car_brand: Optional[str] = Field(None, max_length=100)
    car_model: Optional[str] = Field(None, max_length=100)
    fuel_type: Optional[str] = Field(None, max_length=50)
    service_name: Optional[str] = Field(None, max_length=255)


class BookingCreate(BookingBase):
    """Schema for creating a new booking"""
    pass


class ServiceBookingCreate(BaseModel):
    """Simplified schema for service bookings from frontend Zustand store"""
    booking_date: datetime
    car_brand: str = Field(..., min_length=1, max_length=100)
    car_model: str = Field(..., min_length=1, max_length=100)
    fuel_type: str = Field(..., min_length=1, max_length=50)
    service_name: str = Field(..., min_length=1, max_length=255)
    booking_group_id: Optional[str] = Field(None, max_length=100)


class BookingStatusUpdate(BaseModel):
    """Schema for updating booking status"""
    status: str


class BookingUpdate(BaseModel):
    """Schema for updating a booking"""
    booking_date: Optional[datetime] = None
    status: Optional[BookingStatus] = None
    vehicle_make: Optional[str] = Field(None, min_length=1, max_length=100)
    vehicle_model: Optional[str] = Field(None, min_length=1, max_length=100)
    vehicle_year: Optional[int] = Field(None, ge=1900, le=2100)
    vehicle_registration: Optional[str] = Field(None, min_length=1, max_length=50)
    contact_name: Optional[str] = Field(None, min_length=1, max_length=255)
    contact_phone: Optional[str] = Field(None, max_length=20)
    pickup_address: Optional[str] = Field(None, min_length=10)
    special_instructions: Optional[str] = None
    estimated_cost: Optional[float] = Field(None, gt=0)
    actual_cost: Optional[float] = Field(None, gt=0)
    technician_notes: Optional[str] = None


class EmployeeAssignmentHistoryRead(BaseModel):
    """Schema for reading employee assignment history"""
    id: int
    employee_id: Optional[int] = None
    employee_name: Optional[str] = None
    assigned_by_user_id: int
    assigned_by_name: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


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
    # Include car selection fields
    car_brand: Optional[str] = None
    car_model: Optional[str] = None
    fuel_type: Optional[str] = None
    service_name: Optional[str] = None
    # Booking group ID for multi-service bookings
    booking_group_id: Optional[str] = None
    # User email (for admin view)
    user_email: Optional[str] = None
    # Employee assignment
    assigned_employee_id: Optional[int] = None
    assigned_employee_name: Optional[str] = None
    # Employee assignment history
    employee_assignment_history: Optional[List[EmployeeAssignmentHistoryRead]] = Field(default_factory=list)
    # Daily work logs (now stored in separate table)
    daily_work_logs: Optional[List["DailyWorkLogRead"]] = Field(default_factory=list)
    
    class Config:
        from_attributes = True


# Import here to avoid circular imports
from automex_backend.schemas.daily_work_log import DailyWorkLogRead
BookingRead.model_rebuild()


class DailyWorkDescriptionUpdate(BaseModel):
    """Schema for updating daily work description"""
    description: str = Field(..., min_length=1)


class DailyWorkMediaUpload(BaseModel):
    """Schema for uploading daily work media"""
    file_urls: List[str] = Field(..., min_items=1)


class BookingStatusUpdateResponse(BookingRead):
    """Schema for booking status update response with email notification info"""
    user_email: Optional[str] = None
    email_sent: bool = False
