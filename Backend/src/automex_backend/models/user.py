"""
User model for authentication and user management
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable

from automex_backend.database import Base

if TYPE_CHECKING:
    from automex_backend.models.role import Role


class User(SQLAlchemyBaseUserTable[int], Base):
    """User model for authentication"""
    
    __tablename__ = "user"
    
    # Define id explicitly to fix primary key issue
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    # Email is already unique from SQLAlchemyBaseUserTable, but we'll ensure it's explicit
    # Additional user fields with unique constraint on phone_number
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, default=None)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, unique=True, default=None)
    
    # Role relationship
    role_id: Mapped[int] = mapped_column(ForeignKey("role.id"), nullable=False, default=1)
    role: Mapped["Role"] = relationship("Role", back_populates="users")
    
    # Table-level unique constraint (email is already unique from base class, but phone_number needs it)
    __table_args__ = (
        # Email uniqueness is handled by SQLAlchemyBaseUserTable
        # Phone number uniqueness is handled by unique=True in mapped_column
    )
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role.name if self.role else 'None'})>"

