"""
User model for authentication and user management
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey
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
    
    # Additional user fields
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, default=None)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, default=None)
    
    # Role relationship
    role_id: Mapped[int] = mapped_column(ForeignKey("role.id"), nullable=False, default=1)
    role: Mapped["Role"] = relationship("Role", back_populates="users")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role.name if self.role else 'None'})>"

