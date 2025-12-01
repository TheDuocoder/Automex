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

class ServiceHistoryRead(ServiceHistoryBase):
    id: int
    car_id: int

    class Config:
        from_attributes = True
