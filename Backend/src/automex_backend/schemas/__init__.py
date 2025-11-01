"""
Pydantic schemas for API request/response validation
"""
from automex_backend.schemas.role import RoleRead, RoleCreate, RoleUpdate
from automex_backend.schemas.user import UserRead, UserCreate, UserUpdate
from automex_backend.schemas.service import ServiceRead, ServiceCreate, ServiceUpdate
from automex_backend.schemas.booking import BookingRead, BookingCreate, BookingUpdate

__all__ = [
    "RoleRead",
    "RoleCreate",
    "RoleUpdate",
    "UserRead",
    "UserCreate",
    "UserUpdate",
    "ServiceRead",
    "ServiceCreate",
    "ServiceUpdate",
    "BookingRead",
    "BookingCreate",
    "BookingUpdate",
]

