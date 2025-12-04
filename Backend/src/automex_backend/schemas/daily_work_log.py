"""
Daily Work Log schemas for API validation
"""
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, Field


class DailyWorkLogBase(BaseModel):
    """Base daily work log schema"""
    log_date: date
    description: Optional[str] = None
    photos: List[Dict[str, Any]] = Field(default_factory=list)
    videos: List[Dict[str, Any]] = Field(default_factory=list)


class DailyWorkLogCreate(DailyWorkLogBase):
    """Schema for creating a new daily work log"""
    pass


class DailyWorkLogUpdate(BaseModel):
    """Schema for updating a daily work log"""
    description: Optional[str] = None
    photos: Optional[List[Dict[str, Any]]] = None
    videos: Optional[List[Dict[str, Any]]] = None


class DailyWorkLogRead(DailyWorkLogBase):
    """Schema for reading daily work log data"""
    id: int
    booking_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DailyWorkLogDescriptionUpdate(BaseModel):
    """Schema for updating daily work log description"""
    description: str = Field(..., min_length=1)

