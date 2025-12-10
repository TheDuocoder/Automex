"""
Employee model for super admin to manage employees
"""
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.user import User


class Employee(Base):
    """Employee model for managing staff/employees"""
    
    __tablename__ = "employee"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    # Employee details
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, unique=True)
    position: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # e.g., "Mechanic", "Manager"
    department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # e.g., "Service", "Sales"
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    salary: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    hire_date: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_working_day: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Additional info
    employee_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, unique=True)  # Employee ID number
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Status
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    
    # Timestamps
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Created by super admin
    created_by_user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    created_by: Mapped["User"] = relationship("User", foreign_keys=[created_by_user_id])
    
    def __repr__(self) -> str:
        return f"<Employee(id={self.id}, name={self.full_name}, email={self.email}, position={self.position})>"

