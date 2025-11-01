"""
User model for authentication and user management
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from fastapi_users.db import SQLAlchemyBaseUserTable

from automex_backend.database import Base


class User(SQLAlchemyBaseUserTable[int], Base):
    """User model for authentication"""
    
    __tablename__ = "user"
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"

