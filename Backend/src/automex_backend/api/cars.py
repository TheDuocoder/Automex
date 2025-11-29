"""
Cars API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.car import Car
from automex_backend.models.user import User
from automex_backend.schemas.car import CarRead, CarCreate, CarUpdate
from automex_backend.api.auth import current_active_user

router = APIRouter()

@router.get("/", response_model=List[CarRead])
async def get_cars(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get list of user's cars
    """
    query = select(Car).where(Car.user_id == user.id)
    result = await session.execute(query)
    return result.scalars().all()

@router.post("/", response_model=CarRead, status_code=status.HTTP_201_CREATED)
async def create_car(
    car_data: CarCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Add a new car
    """
    # Check if registration number already exists
    existing_car = await session.execute(select(Car).where(Car.registration_number == car_data.registration_number))
    if existing_car.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Car with this registration number already exists"
        )

    car = Car(**car_data.model_dump(), user_id=user.id)
    session.add(car)
    await session.commit()
    await session.refresh(car)
    return car

@router.get("/{car_id}", response_model=CarRead)
async def get_car(
    car_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get a specific car
    """
    query = select(Car).where(Car.id == car_id, Car.user_id == user.id)
    result = await session.execute(query)
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    
    return car

@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_car(
    car_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete a car
    """
    query = select(Car).where(Car.id == car_id, Car.user_id == user.id)
    result = await session.execute(query)
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    
    await session.delete(car)
    await session.commit()
    return None
