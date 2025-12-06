"""
Service History API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.service_history import ServiceHistory
from automex_backend.models.car import Car
from automex_backend.models.user import User
from automex_backend.schemas.service_history import ServiceHistoryRead, ServiceHistoryCreate, ServiceHistoryUpdate
from automex_backend.api.auth import current_active_user

router = APIRouter()

from typing import Optional
from sqlalchemy.orm import selectinload

async def is_admin_or_super_admin(user: User, session: AsyncSession) -> bool:
    """
    Check if user has Admin or Super Admin role
    """
    if user.is_superuser:
        return True
    
    if hasattr(user, 'role_id') and user.role_id:
        from automex_backend.models.role import Role
        role_stmt = select(Role).where(Role.id == user.role_id)
        role_result = await session.execute(role_stmt)
        role = role_result.scalar_one_or_none()
        if role and role.name in ["admin", "super"]:
            return True
    return False

@router.get("/", response_model=List[ServiceHistoryRead])
async def get_service_history(
    car_id: Optional[int] = Query(None, description="Filter by Car ID"),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get service history.
    If car_id provided: get history for that car (must own car unless Admin).
    If car_id NOT provided:
        - Admin: get ALL history.
        - User: get history for ALL their cars.
    """
    is_admin = await is_admin_or_super_admin(user, session)
    
    query = select(ServiceHistory).join(Car)
    
    if car_id:
        if not is_admin:
            # Verify car belongs to user
            car_check = await session.execute(
                select(Car).where(Car.id == car_id, Car.user_id == user.id)
            )
            if not car_check.scalar_one_or_none():
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
        
        query = query.where(ServiceHistory.car_id == car_id)
    else:
        if not is_admin:
            # Filter by user's cars
            query = query.where(Car.user_id == user.id)
            
    # Always load Car and User relations required by schema
    query = query.options(
        selectinload(ServiceHistory.car).selectinload(Car.user).selectinload(User.role)
    )
            
    query = query.order_by(ServiceHistory.service_date.desc())
    result = await session.execute(query)
    return result.scalars().all()

@router.post("/", response_model=ServiceHistoryRead, status_code=status.HTTP_201_CREATED)
async def create_service_history(
    history_data: ServiceHistoryCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Add a service history record
    """
    # Verify car belongs to user
    car_query = select(Car).where(Car.id == history_data.car_id, Car.user_id == user.id)
    car_result = await session.execute(car_query)
    if not car_result.scalar_one_or_none():
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

    history = ServiceHistory(**history_data.model_dump())
    session.add(history)
    await session.commit()
    await session.commit()
    await session.refresh(history, ['car'])
    if history.car:
        await session.refresh(history.car, ['user'])
        if history.car.user:
            await session.refresh(history.car.user, ['role'])
    return history

@router.put("/{history_id}", response_model=ServiceHistoryRead)
async def update_service_history(
    history_id: int,
    history_data: ServiceHistoryUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update a service history record
    """
    is_admin = await is_admin_or_super_admin(user, session)
    
    # Fetch history and verify ownership
    query = select(ServiceHistory).join(Car).where(ServiceHistory.id == history_id)
    if not is_admin:
        query = query.where(Car.user_id == user.id)
        
    result = await session.execute(query)
    history = result.scalar_one_or_none()
    
    if not history:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service history not found")
        
    for key, value in history_data.model_dump().items():
        setattr(history, key, value)
        
    await session.commit()
    await session.commit()
    await session.refresh(history, ['car'])
    if history.car:
        await session.refresh(history.car, ['user'])
        if history.car.user:
            await session.refresh(history.car.user, ['role'])
    return history

@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service_history(
    history_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete a service history record
    """
    is_admin = await is_admin_or_super_admin(user, session)
    
    # Fetch history and verify ownership
    query = select(ServiceHistory).join(Car).where(ServiceHistory.id == history_id)
    if not is_admin:
        query = query.where(Car.user_id == user.id)
        
    result = await session.execute(query)
    history = result.scalar_one_or_none()
    
    if not history:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service history not found")
        
    await session.delete(history)
    await session.commit()
