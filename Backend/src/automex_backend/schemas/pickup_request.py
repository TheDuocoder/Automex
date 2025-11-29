from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class PickUpRequestBase(BaseModel):
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    scheduled_date: datetime

class PickUpRequestCreate(PickUpRequestBase):
    car_id: int

class PickUpRequestUpdate(BaseModel):
    status: Optional[str] = None
    admin_comment: Optional[str] = None

class PickUpRequestRead(PickUpRequestBase):
    id: int
    user_id: int
    car_id: int
    status: str
    admin_comment: Optional[str] = None

    class Config:
        from_attributes = True
