"""
Car model for user vehicles
"""
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.user import User
    from automex_backend.models.service_history import ServiceHistory
    from automex_backend.models.pickup_request import PickUpRequest


class Car(Base):
    """Car model"""
    
    __tablename__ = "car"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    
    make: Mapped[str] = mapped_column(String(100), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    registration_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    vin_number: Mapped[Optional[str]] = mapped_column(String(17), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", backref="cars")
    service_history: Mapped[List["ServiceHistory"]] = relationship("ServiceHistory", back_populates="car", cascade="all, delete-orphan")
    pickup_requests: Mapped[List["PickUpRequest"]] = relationship("PickUpRequest", back_populates="car", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Car(id={self.id}, make={self.make}, model={self.model}, reg={self.registration_number})>"
