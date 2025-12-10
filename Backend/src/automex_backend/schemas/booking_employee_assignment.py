"""
Booking Employee Assignment schemas
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class BookingEmployeeAssignmentCreate(BaseModel):
    """Schema for assigning employee to booking"""
    employee_id: Optional[int] = Field(None, description="Employee ID to assign. Set to None to unassign.")
    notes: Optional[str] = Field(None, description="Optional notes about the assignment")


class BookingEmployeeAssignmentRead(BaseModel):
    """Schema for reading employee assignment history"""
    id: int
    booking_id: int
    employee_id: Optional[int] = None
    employee_name: Optional[str] = None
    employee_email: Optional[str] = None
    assigned_by_user_id: int
    assigned_by_name: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

