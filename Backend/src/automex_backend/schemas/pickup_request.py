from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class PickUpRequestBase(BaseModel):
    location: Optional[str] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    scheduled_date: datetime

class PickUpRequestCreate(PickUpRequestBase):
    car_id: int

class PickUpRequestUpdate(BaseModel):
    status: Optional[str] = None
    admin_comment: Optional[str] = None
    car_id: Optional[int] = None
    location: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    scheduled_date: Optional[datetime] = None

class PickUpRequestRead(PickUpRequestBase):
    id: int
    user_id: int
    car_id: int
    status: str
    admin_comment: Optional[str] = None

    class Config:
        from_attributes = True
