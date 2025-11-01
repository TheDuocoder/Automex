"""
Role management API endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.role import Role
from automex_backend.models.user import User
from automex_backend.schemas.role import RoleRead, RoleCreate, RoleUpdate
from automex_backend.api.auth import get_current_user_with_role

router = APIRouter(prefix="/roles", tags=["roles"])


@router.get("", response_model=List[RoleRead])
async def get_all_roles(
    session: AsyncSession = Depends(get_async_session),
):
    """Get all available roles"""
    result = await session.execute(select(Role))
    roles = result.scalars().all()
    return roles


@router.get("/{role_id}", response_model=RoleRead)
async def get_role(
    role_id: int,
    session: AsyncSession = Depends(get_async_session),
):
    """Get a specific role by ID"""
    result = await session.execute(select(Role).where(Role.id == role_id))
    role = result.scalar_one_or_none()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    return role


@router.post("", response_model=RoleRead, status_code=status.HTTP_201_CREATED)
async def create_role(
    role_data: RoleCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user_with_role),
):
    """
    Create a new role (Admin only)
    """
    # Check if user is admin or super admin
    if user.role.name not in ["admin", "super"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create roles"
        )
    
    # Check if role name already exists
    result = await session.execute(select(Role).where(Role.name == role_data.name))
    existing_role = result.scalar_one_or_none()
    
    if existing_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role '{role_data.name}' already exists"
        )
    
    # Create new role
    role = Role(**role_data.model_dump())
    session.add(role)
    await session.commit()
    await session.refresh(role)
    
    return role


@router.put("/{role_id}", response_model=RoleRead)
async def update_role(
    role_id: int,
    role_data: RoleUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user_with_role),
):
    """
    Update a role (Admin only)
    """
    # Check if user is admin or super admin
    if user.role.name not in ["admin", "super"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update roles"
        )
    
    # Get the role
    result = await session.execute(select(Role).where(Role.id == role_id))
    role = result.scalar_one_or_none()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    # Update role fields
    update_data = role_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(role, field, value)
    
    await session.commit()
    await session.refresh(role)
    
    return role


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(
    role_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user_with_role),
):
    """
    Delete a role (Super Admin only)
    """
    # Check if user is super admin
    if user.role.name != "super":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super administrators can delete roles"
        )
    
    # Prevent deletion of default roles
    if role_id in [1, 2, 3]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete default roles (normal, admin, super)"
        )
    
    # Get the role
    result = await session.execute(select(Role).where(Role.id == role_id))
    role = result.scalar_one_or_none()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    # Check if any users have this role
    result = await session.execute(select(User).where(User.role_id == role_id))
    users_with_role = result.scalars().all()
    
    if users_with_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete role. {len(users_with_role)} user(s) are assigned to this role"
        )
    
    await session.delete(role)
    await session.commit()

