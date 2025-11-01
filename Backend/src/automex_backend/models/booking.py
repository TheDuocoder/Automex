"""
Booking models for service appointments
"""
from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum
from sqlalchemy import String, Integer, Text, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from automex_backend.database import Base


class BookingStatus(str, PyEnum):
    """Booking status enumeration"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"


class Booking(Base):
    """Booking model for service appointments"""
    
    __tablename__ = "bookings"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Foreign keys
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id"), nullable=False)
    
    # Booking details
    booking_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus),
        nullable=False,
        default=BookingStatus.PENDING
    )
    
    # Vehicle details
    vehicle_make: Mapped[str] = mapped_column(String(length=100), nullable=False)
    vehicle_model: Mapped[str] = mapped_column(String(length=100), nullable=False)
    vehicle_year: Mapped[int] = mapped_column(Integer, nullable=False)
    vehicle_registration: Mapped[str] = mapped_column(String(length=50), nullable=False)
    
    # Contact and location
    contact_name: Mapped[str] = mapped_column(String(length=255), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(length=20), nullable=False)
    pickup_address: Mapped[str] = mapped_column(Text, nullable=False)
    
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
    
    def __repr__(self) -> str:
        return f"<Booking(id={self.id}, user_id={self.user_id}, status={self.status})>"

