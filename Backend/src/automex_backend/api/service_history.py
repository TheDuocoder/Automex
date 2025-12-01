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

@router.get("/", response_model=List[ServiceHistoryRead])
async def get_service_history(
    car_id: int = Query(..., description="Filter by Car ID"),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get service history for a specific car
    """
    # Verify car belongs to user
    car_query = select(Car).where(Car.id == car_id, Car.user_id == user.id)
    car_result = await session.execute(car_query)
    if not car_result.scalar_one_or_none():
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

    query = select(ServiceHistory).where(ServiceHistory.car_id == car_id).order_by(ServiceHistory.service_date.desc())
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
    await session.refresh(history)
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
    # Fetch history and verify ownership
    query = select(ServiceHistory).join(Car).where(ServiceHistory.id == history_id, Car.user_id == user.id)
    result = await session.execute(query)
    history = result.scalar_one_or_none()
    
    if not history:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service history not found")
        
    for key, value in history_data.model_dump().items():
        setattr(history, key, value)
        
    await session.commit()
    await session.refresh(history)
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
    # Fetch history and verify ownership
    query = select(ServiceHistory).join(Car).where(ServiceHistory.id == history_id, Car.user_id == user.id)
    result = await session.execute(query)
    history = result.scalar_one_or_none()
    
    if not history:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service history not found")
        
    await session.delete(history)
    await session.commit()
