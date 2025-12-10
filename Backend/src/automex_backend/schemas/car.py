from typing import Optional
from pydantic import BaseModel

class CarBase(BaseModel):
    make: str
    model: str
    year: int
    registration_number: str
    vin_number: Optional[str] = None
    image_url: Optional[str] = None

class CarCreate(CarBase):
    pass

class CarUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    registration_number: Optional[str] = None
    vin_number: Optional[str] = None
    image_url: Optional[str] = None

from automex_backend.schemas.user import UserRead

class CarRead(CarBase):
    id: int
    user_id: int
    user: Optional[UserRead] = None

    class Config:
        from_attributes = True

