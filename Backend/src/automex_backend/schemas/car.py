from typing import Optional
from pydantic import BaseModel

class CarBase(BaseModel):
    make: str
    model: str
    year: int
    registration_number: str
    image_url: Optional[str] = None

class CarCreate(CarBase):
    pass

class CarUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    registration_number: Optional[str] = None
    image_url: Optional[str] = None

class CarRead(CarBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
