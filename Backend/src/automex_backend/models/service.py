"""
Service models for car maintenance services
"""
from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum
from sqlalchemy import String, Numeric, Text, DateTime, Enum, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column

from automex_backend.database import Base


class ServiceCategory(str, PyEnum):
    """Service category enumeration"""
    GENERAL_SERVICE = "general_service"
    AC_SERVICE = "ac_service"
    BATTERY = "battery"
    TYRES = "tyres"
    DENTING_PAINTING = "denting_painting"
    DETAILING = "detailing"
    INSPECTION = "inspection"
    REPAIR = "repair"
    OTHER = "other"


class Service(Base):
    """Service model for car maintenance services"""
    
    __tablename__ = "services"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(length=255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[ServiceCategory] = mapped_column(
        Enum(ServiceCategory),
        nullable=False,
        default=ServiceCategory.GENERAL_SERVICE
    )
    
    # Pricing
    base_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    discounted_price: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    
    # Service details
    duration_minutes: Mapped[int] = mapped_column(nullable=False, default=60)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Image
    image_url: Mapped[Optional[str]] = mapped_column(String(length=500), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self) -> str:
        return f"<Service(id={self.id}, name={self.name}, category={self.category})>"

