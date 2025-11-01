"""
User schemas for API validation
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    """Schema for reading user data"""
    pass


class UserCreate(schemas.BaseUserCreate):
    """Schema for creating a new user"""
    pass


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating user data"""
    pass

