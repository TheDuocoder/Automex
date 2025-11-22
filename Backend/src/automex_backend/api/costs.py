"""
Cost management API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.cost import Cost
from automex_backend.models.booking import Booking
from automex_backend.schemas.cost import CostRead, CostCreate, CostUpdate, CostListResponse
from automex_backend.api.auth import current_active_user, get_current_user_with_role
from automex_backend.models.user import User

router = APIRouter()


async def is_admin_or_super_admin(user: User, session: AsyncSession) -> bool:
    """
    Check if user has Admin or Super Admin role
    Returns True if user is superuser OR has role 'admin' or 'super'
    """
    # Check if user is superuser
    if user.is_superuser:
        return True
    
    # Check role name
    if hasattr(user, 'role_id') and user.role_id:
        from automex_backend.models.role import Role
        role_stmt = select(Role).where(Role.id == user.role_id)
        role_result = await session.execute(role_stmt)
        role = role_result.scalar_one_or_none()
        if role and role.name in ["admin", "super"]:
            return True
    
    return False


@router.get("/booking/{booking_id}", response_model=CostListResponse)
async def get_booking_costs(
    booking_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get all costs for a specific booking
    Admin and Super Admin can view costs for any booking
    Normal users can only view costs for their own bookings
    """
    # Check if booking exists
    booking_result = await session.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = booking_result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check permissions
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin and booking.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view costs for this booking"
        )
    
    # Get all costs for this booking
    costs_result = await session.execute(
        select(Cost).where(Cost.booking_id == booking_id).order_by(Cost.created_at.asc())
    )
    costs = costs_result.scalars().all()
    
    # Calculate total
    total = sum(cost.amount for cost in costs)
    
    return CostListResponse(
        costs=[CostRead.model_validate(cost) for cost in costs],
        total=total
    )


@router.post("/", response_model=CostRead, status_code=status.HTTP_201_CREATED)
async def create_cost(
    cost_data: CostCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Create a new cost item for a booking
    Only Admin and Super Admin can create costs
    """
    # Check permissions
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can add costs"
        )
    
    # Check if booking exists
    booking_result = await session.execute(
        select(Booking).where(Booking.id == cost_data.booking_id)
    )
    booking = booking_result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Create cost
    cost = Cost(
        booking_id=cost_data.booking_id,
        item_name=cost_data.item_name,
        amount=cost_data.amount,
        description=cost_data.description
    )
    
    session.add(cost)
    await session.commit()
    await session.refresh(cost)
    
    return CostRead.model_validate(cost)


@router.put("/{cost_id}", response_model=CostRead)
async def update_cost(
    cost_id: int,
    cost_data: CostUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update an existing cost item
    Only Admin and Super Admin can update costs
    """
    # Check permissions
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can update costs"
        )
    
    # Get cost
    cost_result = await session.execute(
        select(Cost).where(Cost.id == cost_id)
    )
    cost = cost_result.scalar_one_or_none()
    
    if not cost:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cost not found"
        )
    
    # Update cost fields
    update_data = cost_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cost, field, value)
    
    await session.commit()
    await session.refresh(cost)
    
    return CostRead.model_validate(cost)


@router.delete("/{cost_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cost(
    cost_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete a cost item
    Only Admin and Super Admin can delete costs
    """
    # Check permissions
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can delete costs"
        )
    
    # Get cost
    cost_result = await session.execute(
        select(Cost).where(Cost.id == cost_id)
    )
    cost = cost_result.scalar_one_or_none()
    
    if not cost:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cost not found"
        )
    
    await session.delete(cost)
    await session.commit()
    
    return None

