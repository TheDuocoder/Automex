"""
User schemas for API validation
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    """Schema for reading user data"""
    id: int
    email: EmailStr
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class UserCreate(schemas.BaseUserCreate):
    """Schema for creating a new user"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    phone_number: Optional[str] = Field(None, pattern=r"^\+?[1-9]\d{1,14}$")


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating user data"""
    password: Optional[str] = Field(None, min_length=8)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = Field(None, pattern=r"^\+?[1-9]\d{1,14}$")

