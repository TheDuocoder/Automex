"""
Booking Employee Assignment History model
Tracks history of employee assignments to bookings
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.booking import Booking
    from automex_backend.models.employee import Employee
    from automex_backend.models.user import User


class BookingEmployeeAssignment(Base):
    """Tracks history of employee assignments to bookings"""
    
    __tablename__ = "booking_employee_assignment"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[int] = mapped_column(ForeignKey("bookings.id"), nullable=False)
    employee_id: Mapped[Optional[int]] = mapped_column(ForeignKey("employee.id"), nullable=True)  # NULL means unassigned
    assigned_by_user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)  # Super admin who made the assignment
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Optional notes about the assignment
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    booking: Mapped["Booking"] = relationship("Booking", back_populates="employee_assignments")
    employee: Mapped[Optional["Employee"]] = relationship("Employee")
    assigned_by: Mapped["User"] = relationship("User", foreign_keys=[assigned_by_user_id])
    
    def __repr__(self) -> str:
        return f"<BookingEmployeeAssignment(id={self.id}, booking_id={self.booking_id}, employee_id={self.employee_id})>"

