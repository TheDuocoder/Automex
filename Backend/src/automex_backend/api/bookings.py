"""
Booking management API routes
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.booking import Booking, BookingStatus
from automex_backend.models.service import Service
from automex_backend.models.user import User
from automex_backend.schemas.booking import BookingRead, BookingCreate, BookingUpdate, ServiceBookingCreate
from automex_backend.api.auth import current_active_user

router = APIRouter()


@router.get("/", response_model=List[BookingRead])
async def get_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status_filter: Optional[BookingStatus] = None,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get list of bookings for current user
    Superusers can see all bookings
    """
    query = select(Booking)
    
    # Non-superusers can only see their own bookings
    if not user.is_superuser:
        query = query.where(Booking.user_id == user.id)
    
    if status_filter:
        query = query.where(Booking.status == status_filter)
    
    query = query.offset(skip).limit(limit).order_by(Booking.created_at.desc())
    result = await session.execute(query)
    bookings = result.scalars().all()
    
    return bookings


@router.get("/{booking_id}", response_model=BookingRead)
async def get_booking(
    booking_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get a specific booking by ID
    """
    result = await session.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if user has permission to view this booking
    if not user.is_superuser and booking.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this booking"
        )
    
    return booking


@router.post("/", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Create a new booking
    """
    # Verify service exists if service_id is provided
    if booking_data.service_id:
        result = await session.execute(
            select(Service).where(Service.id == booking_data.service_id)
        )
        service = result.scalar_one_or_none()
        
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        
        if not service.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This service is not currently available"
            )
        
        estimated_cost = float(service.discounted_price or service.base_price)
    else:
        estimated_cost = None
    
    # Create booking
    booking = Booking(
        **booking_data.model_dump(),
        user_id=user.id,
        estimated_cost=estimated_cost
    )
    
    session.add(booking)
    await session.commit()
    await session.refresh(booking)
    
    return booking


@router.post("/service-booking", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
async def create_service_booking(
    booking_data: ServiceBookingCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Create a new service booking from frontend Zustand store data
    """
    try:
        # Pydantic automatically parses ISO datetime strings, so booking_data.booking_date is already a datetime
        # Get contact information from user
        contact_name = user.full_name if user.full_name else (user.email if user.email else "User")
        contact_phone = user.phone_number if user.phone_number else None
        
        # Create booking with car selection details
        # Only include fields that exist in the database to avoid column errors
        booking_data_dict = {
            "user_id": user.id,
            "booking_date": booking_data.booking_date,
            "status": BookingStatus.PENDING,
            "contact_name": contact_name,
            "contact_phone": contact_phone,
            "pickup_address": None,
        }
        
        # Add car selection fields (may not exist in old database schema)
        try:
            booking_data_dict.update({
                "car_brand": booking_data.car_brand,
                "car_model": booking_data.car_model,
                "fuel_type": booking_data.fuel_type,
                "service_name": booking_data.service_name,
                "vehicle_make": booking_data.car_brand,
                "vehicle_model": booking_data.car_model,
            })
        except Exception as field_error:
            print(f"[WARNING] Could not add car selection fields: {field_error}")
            # Fallback: use vehicle_make/model only
            booking_data_dict.update({
                "vehicle_make": booking_data.car_brand,
                "vehicle_model": booking_data.car_model,
            })
        
        booking = Booking(**booking_data_dict)
        
        session.add(booking)
        await session.commit()
        await session.refresh(booking)
        
        return booking
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        error_msg = str(e)
        print(f"[ERROR] Error creating service booking: {error_msg}")
        print(f"[ERROR] Traceback:\n{error_trace}")
        print(f"[ERROR] Booking data: {booking_data.model_dump()}")
        print(f"[ERROR] User ID: {user.id if user else 'None'}")
        await session.rollback()
        
        # Check if it's a column error
        if "no such column" in error_msg.lower() or "column" in error_msg.lower():
            detail_msg = (
                "Database schema needs to be updated. "
                "Please restart the backend server to recreate tables with the new schema, "
                "or run the schema update script."
            )
        else:
            detail_msg = f"Failed to create booking: {error_msg}"
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail_msg
        )


@router.put("/{booking_id}", response_model=BookingRead)
async def update_booking(
    booking_id: int,
    booking_data: BookingUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update an existing booking
    """
    result = await session.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check permissions
    if not user.is_superuser and booking.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this booking"
        )
    
    # Update booking fields
    for field, value in booking_data.model_dump(exclude_unset=True).items():
        setattr(booking, field, value)
    
    # If status is completed, set completed_at
    if booking.status == BookingStatus.COMPLETED and not booking.completed_at:
        booking.completed_at = datetime.utcnow()
    
    await session.commit()
    await session.refresh(booking)
    
    return booking


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking(
    booking_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Cancel a booking (sets status to CANCELLED)
    """
    result = await session.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check permissions
    if not user.is_superuser and booking.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to cancel this booking"
        )
    
    # Update status to cancelled
    booking.status = BookingStatus.CANCELLED
    await session.commit()
    
    return None

