"""
Pydantic schemas for Role model
"""
from pydantic import BaseModel, ConfigDict


class RoleBase(BaseModel):
    """Base role schema"""
    name: str
    description: str | None = None


class RoleCreate(RoleBase):
    """Schema for creating a role"""
    pass


class RoleUpdate(BaseModel):
    """Schema for updating a role"""
    name: str | None = None
    description: str | None = None


class RoleRead(RoleBase):
    """Schema for reading a role"""
    id: int
    
    model_config = ConfigDict(from_attributes=True)

