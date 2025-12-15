"""
Cars API routes
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.car import Car
from automex_backend.models.user import User
from automex_backend.schemas.car import CarRead, CarCreate, CarUpdate
from automex_backend.api.auth import current_active_user

router = APIRouter()

from sqlalchemy.orm import selectinload

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

@router.get("/", response_model=List[CarRead])
async def get_cars(
    user_id: Optional[int] = None,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get list of cars.
    Admins can see all cars; users see only their own.
    Admins can filter by user_id to see specific user's cars.
    """
    is_admin = await is_admin_or_super_admin(user, session)
    
    query = select(Car)
    
    if not is_admin:
        query = query.where(Car.user_id == user.id)
    elif user_id:
        # If admin and user_id is provided, filter by that user
        query = query.where(Car.user_id == user_id)
        
    # Always load user relationship as it is required by schema
    query = query.options(selectinload(Car.user).selectinload(User.role))
    
    result = await session.execute(query)
    return result.scalars().all()

@router.post("/", response_model=CarRead, status_code=status.HTTP_201_CREATED)
async def create_car(
    make: str = Form(...),
    model: str = Form(...),
    year: int = Form(...),
    registration_number: str = Form(...),
    vin_number: Optional[str] = Form(None),
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
        # Use user's email as username for folder structure
        username = user.email
        image_url = await s3_service.upload_file(image, username=username)

    car = Car(
        make=make,
        model=model,
        year=year,
        registration_number=registration_number,
        vin_number=vin_number,
        image_url=image_url,
        user_id=user.id
    )
    session.add(car)
    await session.commit()
    await session.refresh(car, ['user'])
    # Also load the nested role for the user, just in case
    if car.user:
        await session.refresh(car.user, ['role'])
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
    is_admin = await is_admin_or_super_admin(user, session)
    
    query = select(Car).where(Car.id == car_id)
    if not is_admin:
        query = query.where(Car.user_id == user.id)
    else:
        # Admin view, load user relation
        query = query.options(selectinload(Car.user).selectinload(User.role))
        
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
    vin_number: str = Form(None),
    image: UploadFile = File(None),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update a car
    """
    is_admin = await is_admin_or_super_admin(user, session)
    
    query = select(Car).where(Car.id == car_id)
    if not is_admin:
        query = query.where(Car.user_id == user.id)
        
    result = await session.execute(query)
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    
    # Check if registration number is being updated and if it already exists
    if registration_number and registration_number != car.registration_number:
        # Check globally for registration number uniqueness
        # We don't exclude other users' cars here because reg number must be unique globally
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
    if vin_number is not None:
        car.vin_number = vin_number
    
    # Handle image upload
    if image:
        from automex_backend.services.s3 import s3_service
        
        # Delete old image from S3 if exists
        if car.image_url:
            await s3_service.delete_file(car.image_url)
        
        # Upload new image with user-specific folder (use car owner's email)
        # Determine username for folder
        if is_admin:
            # If admin, fetch car owner to get email
            # We need to load user
            await session.refresh(car, ['user'])
            username = car.user.email
        else:
            username = user.email
            
        image_url = await s3_service.upload_file(image, username=username)
        car.image_url = image_url
    
    await session.commit()
    await session.refresh(car, ['user'])
    if car.user:
        await session.refresh(car.user, ['role'])
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
    is_admin = await is_admin_or_super_admin(user, session)
    
    query = select(Car).where(Car.id == car_id)
    if not is_admin:
        query = query.where(Car.user_id == user.id)
        
    result = await session.execute(query)
    car = result.scalar_one_or_none()
    
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    
    # Store image URL before deletion for S3 cleanup
    image_url = car.image_url
    
    # Delete image from S3 if exists
    if image_url:
        try:
            from automex_backend.services.s3 import s3_service
            deletion_success = await s3_service.delete_file(image_url)
            if deletion_success:
                print(f"Successfully deleted S3 image for car {car_id}: {image_url}")
            else:
                print(f"Warning: Failed to delete S3 image for car {car_id}: {image_url}")
        except Exception as e:
            # Log error but don't prevent car deletion
            print(f"Error deleting S3 image for car {car_id}: {str(e)}")
            print(f"Image URL: {image_url}")
    
    # Delete car from database
    await session.delete(car)
    await session.commit()
    print(f"Successfully deleted car {car_id} (Registration: {car.registration_number})")
    return None
