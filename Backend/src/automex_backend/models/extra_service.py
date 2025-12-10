"""
Extra Service model for admin/super admin to manage additional services
"""
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.user import User
    from automex_backend.models.employee import Employee


class ExtraService(Base):
    """Extra Service model for managing additional services"""
    
    __tablename__ = "extra_service"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    # Service details
    service_name: Mapped[str] = mapped_column(String(255), nullable=False)
    vehicle_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    assigned_employee_id: Mapped[Optional[int]] = mapped_column(ForeignKey("employee.id"), nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)  # Price in rupees
    owner_details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Owner name, phone, etc.
    service_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Created by admin/super admin
    created_by_user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    
    # Timestamps
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    created_by: Mapped["User"] = relationship("User", foreign_keys=[created_by_user_id])
    assigned_employee: Mapped[Optional["Employee"]] = relationship("Employee", foreign_keys=[assigned_employee_id])
    
    def __repr__(self) -> str:
        return f"<ExtraService(id={self.id}, service_name={self.service_name}, price={self.price})>"

