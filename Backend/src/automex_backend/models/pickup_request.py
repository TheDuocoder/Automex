"""
Pick Up Request model
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.user import User
    from automex_backend.models.car import Car


class PickUpRequest(Base):
    """Pick Up Request model"""
    
    __tablename__ = "pickup_request"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    car_id: Mapped[int] = mapped_column(ForeignKey("car.id"), nullable=False)
    
    location: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    address: Mapped[str] = mapped_column(String(500), nullable=False, default="Not Provided")
    latitude: Mapped[Optional[float]] = mapped_column(nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(nullable=True)
    scheduled_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    pickup_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)  # Actual pickup time set by admin
    drop_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)  # Actual drop time set by admin
    status: Mapped[str] = mapped_column(String(50), default="Pending") # Pending, Approved, Completed, Cancelled
    admin_comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user: Mapped["User"] = relationship("User", backref="pickup_requests")
    car: Mapped["Car"] = relationship("Car", back_populates="pickup_requests")

    def __repr__(self) -> str:
        return f"<PickUpRequest(id={self.id}, user={self.user_id}, status={self.status})>"
