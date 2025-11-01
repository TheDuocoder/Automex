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
from automex_backend.schemas.booking import BookingRead, BookingCreate, BookingUpdate
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
    # Verify service exists
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
    
    # Create booking
    booking = Booking(
        **booking_data.model_dump(),
        user_id=user.id,
        estimated_cost=float(service.discounted_price or service.base_price)
    )
    
    session.add(booking)
    await session.commit()
    await session.refresh(booking)
    
    return booking


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

