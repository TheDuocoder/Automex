"""
Service History model for cars
"""
from datetime import date
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, Date, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.car import Car


class ServiceHistory(Base):
    """Service History model"""
    
    __tablename__ = "service_history"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("car.id"), nullable=False)
    
    service_name: Mapped[str] = mapped_column(String(200), nullable=False)
    service_date: Mapped[date] = mapped_column(Date, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Completed")
    
    # Relationships
    car: Mapped["Car"] = relationship("Car", back_populates="service_history")

    def __repr__(self) -> str:
        return f"<ServiceHistory(id={self.id}, service={self.service_name}, date={self.service_date})>"
