"""
Cost schemas for API validation
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CostBase(BaseModel):
    """Base cost schema"""
    item_name: str = Field(..., min_length=1, max_length=255, description="Name of the cost item")
    amount: float = Field(..., gt=0, description="Amount in rupees")
    description: Optional[str] = Field(None, description="Optional description of the cost item")
    warranty_details: Optional[str] = Field(None, max_length=255, description="Optional warranty details")


class CostCreate(CostBase):
    """Schema for creating a cost item"""
    booking_id: int = Field(..., description="ID of the booking this cost belongs to")


class CostUpdate(BaseModel):
    """Schema for updating a cost item"""
    item_name: Optional[str] = Field(None, min_length=1, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    warranty_details: Optional[str] = None


class CostRead(CostBase):
    """Schema for reading cost data"""
    id: int
    booking_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class CostListResponse(BaseModel):
    """Response schema for listing costs"""
    costs: list[CostRead]
    total: float = Field(..., description="Total amount of all costs")

