"""
Cost model for booking cost breakdown
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.booking import Booking


class Cost(Base):
    """Cost model for booking cost breakdown items"""
    
    __tablename__ = "costs"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    
    # Foreign key to booking
    booking_id: Mapped[int] = mapped_column(ForeignKey("bookings.id"), nullable=False, index=True)
    
    # Cost item details
    item_name: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationship to booking
    booking: Mapped["Booking"] = relationship("Booking", back_populates="costs")
    
    def __repr__(self) -> str:
        return f"<Cost(id={self.id}, booking_id={self.booking_id}, item_name={self.item_name}, amount={self.amount})>"

