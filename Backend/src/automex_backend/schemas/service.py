"""
Service schemas for API validation
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from automex_backend.models.service import ServiceCategory


class ServiceBase(BaseModel):
    """Base service schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: ServiceCategory
    base_price: float = Field(..., gt=0)
    discounted_price: Optional[float] = Field(None, gt=0)
    duration_minutes: int = Field(..., gt=0)
    is_active: bool = True
    image_url: Optional[str] = None


class ServiceCreate(ServiceBase):
    """Schema for creating a new service"""
    pass


class ServiceUpdate(BaseModel):
    """Schema for updating a service"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[ServiceCategory] = None
    base_price: Optional[float] = Field(None, gt=0)
    discounted_price: Optional[float] = Field(None, gt=0)
    duration_minutes: Optional[int] = Field(None, gt=0)
    is_active: Optional[bool] = None
    image_url: Optional[str] = None


class ServiceRead(ServiceBase):
    """Schema for reading service data"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

