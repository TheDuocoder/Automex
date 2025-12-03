"""
Cars API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
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
    make: str = Form(...),
    model: str = Form(...),
    year: int = Form(...),
    registration_number: str = Form(...),
    image: UploadFile = File(None),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Add a new car
    """
    # Check if registration number already exists
    existing_car = await session.execute(select(Car).where(Car.registration_number == registration_number))
    if existing_car.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Car with this registration number already exists"
        )

    image_url = None
    if image:
        from automex_backend.services.s3 import s3_service
        image_url = await s3_service.upload_file(image)

    car = Car(
        make=make,
        model=model,
        year=year,
        registration_number=registration_number,
        image_url=image_url,
        user_id=user.id
    )
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

@router.patch("/{car_id}", response_model=CarRead)
async def update_car(
    car_id: int,
    make: str = Form(None),
    model: str = Form(None),
    year: int = Form(None),
    registration_number: str = Form(None),
    image: UploadFile = File(None),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update a car
    """
    query = select(Car).where(Car.id == car_id, Car.user_id == user.id)
    result = await session.execute(query)
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    
    # Check if registration number is being updated and if it already exists
    if registration_number and registration_number != car.registration_number:
        existing_car = await session.execute(
            select(Car).where(
                Car.registration_number == registration_number,
                Car.id != car_id
            )
        )
        if existing_car.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Car with this registration number already exists"
            )
    
    # Update car fields
    if make:
        car.make = make
    if model:
        car.model = model
    if year:
        car.year = year
    if registration_number:
        car.registration_number = registration_number
    
    # Handle image upload
    if image:
        from automex_backend.services.s3 import s3_service
        
        # Delete old image from S3 if exists
        if car.image_url:
            await s3_service.delete_file(car.image_url)
        
        # Upload new image
        image_url = await s3_service.upload_file(image)
        car.image_url = image_url
    
    await session.commit()
    await session.refresh(car)
    return car

@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_car(
    car_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete a car and its associated S3 image
    """
    query = select(Car).where(Car.id == car_id, Car.user_id == user.id)
    result = await session.execute(query)
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    
    # Delete image from S3 if exists
    if car.image_url:
        from automex_backend.services.s3 import s3_service
        await s3_service.delete_file(car.image_url)
    
    await session.delete(car)
    await session.commit()
    return None
