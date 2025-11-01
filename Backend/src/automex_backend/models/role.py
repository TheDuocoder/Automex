"""
Role model for user authorization
"""
from typing import List
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from automex_backend.database import Base


class Role(Base):
    """Role model for authorization"""
    
    __tablename__ = "role"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # Relationship to users
    users: Mapped[List["User"]] = relationship("User", back_populates="role")
    
    def __repr__(self) -> str:
        return f"<Role(id={self.id}, name={self.name})>"

