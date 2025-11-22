"""
Booking management API routes
"""
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.booking import Booking, BookingStatus
from automex_backend.models.service import Service
from automex_backend.models.user import User
from automex_backend.schemas.booking import BookingRead, BookingCreate, BookingUpdate, ServiceBookingCreate, BookingStatusUpdate
from automex_backend.api.auth import current_active_user, get_current_user_with_role

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


@router.get("/", response_model=List[BookingRead])
async def get_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status_filter: Optional[BookingStatus] = None,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get list of bookings
    Admin and Super Admin can see all bookings
    Normal users can only see their own bookings
    """
    query = select(Booking)
    
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    
    # Non-admin users can only see their own bookings
    if not is_admin:
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
    Admin and Super Admin can view any booking
    Normal users can only view their own bookings
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
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin and booking.user_id != user.id:
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


@router.patch("/{booking_id}/status", response_model=BookingRead)
async def update_booking_status(
    booking_id: int,
    status_update: BookingStatusUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update booking status (Admin and Super Admin only)
    """
    print(f"[DEBUG] update_booking_status called: booking_id={booking_id}, status={status_update.status}, user_id={user.id if user else None}")
    
    # Validate status first - check against enum VALUES, not names
    status_value = status_update.status.lower().strip()
    valid_statuses = {s.value for s in BookingStatus}
    
    if status_value not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status value: {status_update.status}. Valid values are: {', '.join(sorted(valid_statuses))}"
        )
    
    # Find the enum member by value (not name)
    new_status = None
    for status_enum in BookingStatus:
        if status_enum.value == status_value:
            new_status = status_enum
            break
    
    if not new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status value: {status_update.status}. Valid values are: {', '.join(sorted(valid_statuses))}"
        )
    
        print(f"[DEBUG] Validated status: {new_status.name} = {new_status.value}")
    
    try:
        # Check if user is Admin or Super Admin using helper function
        is_admin = await is_admin_or_super_admin(user, session)
        
        if not is_admin:
            print(f"[DEBUG] User {user.id} is not admin or super, denying access")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Admin and Super Admin can change booking status"
            )
        
        print(f"[DEBUG] Permission check passed, getting booking {booking_id}")
        
        # Get booking
        booking_result = await session.execute(
            select(Booking).where(Booking.id == booking_id)
        )
        booking = booking_result.scalar_one_or_none()
        
        if not booking:
            print(f"[DEBUG] Booking {booking_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        print(f"[DEBUG] Booking found, current status: {booking.status}, updating to: {new_status}")
        print(f"[DEBUG] New status value: {new_status.value}, type: {type(new_status)}")
        
        # Get the string value from enum
        status_value = new_status.value if isinstance(new_status, BookingStatus) else str(new_status)
        print(f"[DEBUG] Status string value to store: {status_value}")
        
        # Use raw SQL update to bypass SQLAlchemy's enum type conversion
        # This ensures we store the string value directly without enum name conversion
        from sqlalchemy import text
        
        # Build SQL update with bind parameter for status
        sql_query = text("""
            UPDATE bookings 
            SET status = :status_value, updated_at = NOW()
            WHERE id = :booking_id
        """)
        
        params = {
            "status_value": status_value,
            "booking_id": booking_id
        }
        
        # If status is completed, set completed_at
        if new_status == BookingStatus.COMPLETED and not booking.completed_at:
            sql_query = text("""
                UPDATE bookings 
                SET status = :status_value, 
                    completed_at = :completed_at,
                    updated_at = NOW()
                WHERE id = :booking_id
            """)
            params["completed_at"] = datetime.now(timezone.utc)
        
        print(f"[DEBUG] Executing raw SQL update with status: {status_value}")
        try:
            result = await session.execute(sql_query, params)
            print(f"[DEBUG] Update executed, rows affected: {result.rowcount}")
            await session.commit()
            print(f"[DEBUG] Update committed successfully")
        except Exception as commit_error:
            print(f"[ERROR] Commit failed: {commit_error}")
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save booking status update: {str(commit_error)}"
            )
        
        print(f"[DEBUG] Refreshing booking")
        try:
            await session.refresh(booking)
            print(f"[DEBUG] Booking refreshed, status is now: {booking.status}")
        except Exception as refresh_error:
            print(f"[WARNING] Refresh failed but commit succeeded: {refresh_error}")
            # Re-fetch the booking to ensure we have the latest data
            booking_result = await session.execute(
                select(Booking).where(Booking.id == booking_id)
            )
            booking = booking_result.scalar_one_or_none()
        
        # Return booking - FastAPI will serialize it using BookingRead schema
        return booking
    except HTTPException as http_ex:
        print(f"[DEBUG] HTTPException raised: {http_ex.status_code} - {http_ex.detail}")
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        error_msg = str(e)
        print(f"[ERROR] Error updating booking status: {error_msg}")
        print(f"[ERROR] Booking ID: {booking_id}, New Status: {status_update.status}")
        print(f"[ERROR] User ID: {user.id if user else 'None'}")
        print(f"[ERROR] User is_superuser: {user.is_superuser if user else 'None'}")
        print(f"[ERROR] User role_id: {getattr(user, 'role_id', 'N/A')}")
        print(f"[ERROR] Traceback:\n{error_trace}")
        try:
            await session.rollback()
        except Exception as rollback_error:
            print(f"[ERROR] Failed to rollback: {rollback_error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update booking status: {error_msg}. Check server logs for details."
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
    Admin and Super Admin can update any booking
    Normal users can only update their own bookings
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
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin and booking.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this booking"
        )
    
    # Update booking fields
    for field, value in booking_data.model_dump(exclude_unset=True).items():
        setattr(booking, field, value)
    
    # If status is completed, set completed_at
    if booking.status == BookingStatus.COMPLETED and not booking.completed_at:
        booking.completed_at = datetime.now(timezone.utc)
    
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
    Admin and Super Admin can cancel any booking
    Normal users can only cancel their own bookings
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
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin and booking.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to cancel this booking"
        )
    
    # Update status to cancelled
    booking.status = BookingStatus.CANCELLED
    await session.commit()
    
    return None

