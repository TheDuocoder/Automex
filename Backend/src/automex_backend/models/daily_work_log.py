"""
Daily Work Log model for booking service work documentation
"""
from datetime import datetime, date
from typing import Optional, List
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, func, JSON, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from automex_backend.database import Base


class DailyWorkLog(Base):
    """Daily Work Log model for storing date-wise work documentation"""
    
    __tablename__ = "daily_work_logs"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Foreign key to booking
    booking_id: Mapped[int] = mapped_column(ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Date for this log entry (YYYY-MM-DD)
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    
    # Description of work done on this date
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Media URLs (stored as JSON arrays of objects with {date, url})
    photos: Mapped[Optional[List[dict]]] = mapped_column(JSON, nullable=True, default=list)
    videos: Mapped[Optional[List[dict]]] = mapped_column(JSON, nullable=True, default=list)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationship to booking
    booking: Mapped["Booking"] = relationship("Booking", back_populates="daily_work_logs")
    
    def __repr__(self) -> str:
        return f"<DailyWorkLog(id={self.id}, booking_id={self.booking_id}, log_date={self.log_date})>"

