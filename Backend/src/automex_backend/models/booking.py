"""
Booking models for service appointments
"""
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from enum import Enum as PyEnum
from sqlalchemy import String, Integer, Text, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.cost import Cost
    from automex_backend.models.daily_work_log import DailyWorkLog


class BookingStatus(str, PyEnum):
    """Booking status enumeration"""
    PENDING = "pending"
    ANALYSE = "analyse"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Booking(Base):
    """Booking model for service appointments"""
    
    __tablename__ = "bookings"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Foreign keys
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    service_id: Mapped[Optional[int]] = mapped_column(ForeignKey("service.id"), nullable=True)
    
    # Booking details
    booking_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(
        String(length=50),
        nullable=False,
        default=BookingStatus.PENDING.value
    )
    
    # Vehicle details
    vehicle_make: Mapped[Optional[str]] = mapped_column(String(length=100), nullable=True)
    vehicle_model: Mapped[Optional[str]] = mapped_column(String(length=100), nullable=True)
    vehicle_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    vehicle_registration: Mapped[Optional[str]] = mapped_column(String(length=50), nullable=True)
    # Car selection details from Zustand store
    car_brand: Mapped[Optional[str]] = mapped_column(String(length=100), nullable=True)
    car_model: Mapped[Optional[str]] = mapped_column(String(length=100), nullable=True)
    fuel_type: Mapped[Optional[str]] = mapped_column(String(length=50), nullable=True)
    service_name: Mapped[Optional[str]] = mapped_column(String(length=255), nullable=True)
    
    # Contact and location
    contact_name: Mapped[Optional[str]] = mapped_column(String(length=255), nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(length=20), nullable=True)
    pickup_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Additional information
    special_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    estimated_cost: Mapped[Optional[float]] = mapped_column(nullable=True)
    actual_cost: Mapped[Optional[float]] = mapped_column(nullable=True)
    
    # Technician notes (for internal use)
    technician_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    costs: Mapped[List["Cost"]] = relationship("Cost", back_populates="booking", cascade="all, delete-orphan")
    daily_work_logs: Mapped[List["DailyWorkLog"]] = relationship("DailyWorkLog", back_populates="booking", cascade="all, delete-orphan")
    
    @property
    def status_enum(self) -> BookingStatus:
        """Convert string status to BookingStatus enum"""
        if isinstance(self.status, BookingStatus):
            return self.status
        # Find enum by value
        for status_enum in BookingStatus:
            if status_enum.value == self.status:
                return status_enum
        # Fallback to PENDING if not found
        return BookingStatus.PENDING
    
    def __repr__(self) -> str:
        return f"<Booking(id={self.id}, user_id={self.user_id}, status={self.status})>"

