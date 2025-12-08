from typing import Optional
from datetime import date
from pydantic import BaseModel

class ServiceHistoryBase(BaseModel):
    service_name: str
    service_date: date
    description: Optional[str] = None
    status: str = "Completed"

class ServiceHistoryCreate(ServiceHistoryBase):
    car_id: int

class ServiceHistoryUpdate(ServiceHistoryBase):
    pass

from automex_backend.schemas.car import CarRead

class ServiceHistoryRead(ServiceHistoryBase):
    id: int
    car_id: int
    car: Optional[CarRead] = None

    class Config:
        from_attributes = True
