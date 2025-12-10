"""
Extra Service schemas
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ExtraServiceBase(BaseModel):
    """Base schema for extra service"""
    service_name: str = Field(..., min_length=1, max_length=255, description="Service name")
    vehicle_name: Optional[str] = Field(None, max_length=255, description="Vehicle name (optional)")
    assigned_employee_id: Optional[int] = Field(None, description="Assigned employee ID")
    price: float = Field(..., gt=0, description="Price in rupees")
    owner_details: Optional[str] = Field(None, description="Owner details (optional)")
    service_description: Optional[str] = Field(None, description="Service description")


class ExtraServiceCreate(ExtraServiceBase):
    """Schema for creating extra service"""
    pass


class ExtraServiceUpdate(BaseModel):
    """Schema for updating extra service"""
    service_name: Optional[str] = Field(None, min_length=1, max_length=255)
    vehicle_name: Optional[str] = Field(None, max_length=255)
    assigned_employee_id: Optional[int] = None
    price: Optional[float] = Field(None, gt=0)
    owner_details: Optional[str] = None
    service_description: Optional[str] = None


class ExtraServiceRead(ExtraServiceBase):
    """Schema for reading extra service"""
    id: int
    created_by_user_id: int
    created_by_name: Optional[str] = None
    assigned_employee_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

