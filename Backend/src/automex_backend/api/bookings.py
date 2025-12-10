"""
Booking management API routes
"""
import re
from typing import List, Optional, Dict
from datetime import datetime, timezone, date
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from automex_backend.database import get_async_session
from automex_backend.models.booking import Booking, BookingStatus
from automex_backend.models.service import Service
from automex_backend.models.user import User
from automex_backend.models.daily_work_log import DailyWorkLog
from automex_backend.schemas.booking import (
    BookingRead, BookingCreate, BookingUpdate, ServiceBookingCreate, BookingStatusUpdate, BookingStatusUpdateResponse
)
from automex_backend.schemas.daily_work_log import (
    DailyWorkLogRead, DailyWorkLogCreate, DailyWorkLogUpdate, DailyWorkLogDescriptionUpdate
)
from automex_backend.schemas.booking_employee_assignment import BookingEmployeeAssignmentCreate
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


async def is_super_admin_only(user: User, session: AsyncSession) -> bool:
    """
    Check if user is Super Admin only (not regular admin)
    Returns True if user is superuser OR has role 'super'
    """
    # Check if user is superuser
    if user.is_superuser:
        return True
    
    # Check role name - must be 'super', not 'admin'
    if hasattr(user, 'role_id') and user.role_id:
        from automex_backend.models.role import Role
        role_stmt = select(Role).where(Role.id == user.role_id)
        role_result = await session.execute(role_stmt)
        role = role_result.scalar_one_or_none()
        if role and role.name == "super":
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
    
    query = query.options(selectinload(Booking.daily_work_logs))
    query = query.offset(skip).limit(limit).order_by(Booking.created_at.desc())
    result = await session.execute(query)
    bookings = result.scalars().all()
    
    # Load user emails
    user_ids = {booking.user_id for booking in bookings}
    users = {}
    if user_ids:
        users_stmt = select(User).where(User.id.in_(user_ids))
        users_result = await session.execute(users_stmt)
        users = {user.id: user.email for user in users_result.scalars().all()}
    
    # Load assigned employee names
    from automex_backend.models.employee import Employee
    employee_ids = {booking.assigned_employee_id for booking in bookings if booking.assigned_employee_id}
    employees = {}
    if employee_ids:
        emp_stmt = select(Employee).where(Employee.id.in_(employee_ids))
        emp_result = await session.execute(emp_stmt)
        employees = {emp.id: emp.full_name for emp in emp_result.scalars().all()}
    
    # Convert bookings to response models with user emails and employee names
    booking_list = []
    for booking in bookings:
        assigned_employee_name = None
        if booking.assigned_employee_id:
            assigned_employee_name = employees.get(booking.assigned_employee_id)
        
        booking_dict = {
            **{k: getattr(booking, k) for k in BookingRead.model_fields.keys() if hasattr(booking, k)},
            "user_email": users.get(booking.user_id),
            "assigned_employee_id": booking.assigned_employee_id,
            "assigned_employee_name": assigned_employee_name,
            "daily_work_logs": booking.daily_work_logs or []
        }
        booking_list.append(BookingRead(**booking_dict))
    
    return booking_list if user_ids or employee_ids else bookings


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
    try:
        result = await session.execute(
            select(Booking)
            .where(Booking.id == booking_id)
            .options(selectinload(Booking.daily_work_logs))
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
        
        # Ensure daily_work_logs is initialized (should be handled by relationship, but just in case)
        if booking.daily_work_logs is None:
            booking.daily_work_logs = []
        
        # Load user email for admin view
        user_stmt = select(User).where(User.id == booking.user_id)
        user_result = await session.execute(user_stmt)
        booking_user = user_result.scalar_one_or_none()
        
        # Load assigned employee info
        assigned_employee_name = None
        if booking.assigned_employee_id:
            from automex_backend.models.employee import Employee
            emp_stmt = select(Employee).where(Employee.id == booking.assigned_employee_id)
            emp_result = await session.execute(emp_stmt)
            employee = emp_result.scalar_one_or_none()
            assigned_employee_name = employee.full_name if employee else None
        
        # Load employee assignment history
        from automex_backend.models.booking_employee_assignment import BookingEmployeeAssignment
        assignment_stmt = select(BookingEmployeeAssignment).where(
            BookingEmployeeAssignment.booking_id == booking.id
        ).order_by(BookingEmployeeAssignment.created_at.desc())
        assignment_result = await session.execute(assignment_stmt)
        assignments = assignment_result.scalars().all()
        
        # Build assignment history
        assignment_history = []
        for assignment in assignments:
            emp_name = None
            if assignment.employee_id:
                emp_stmt = select(Employee).where(Employee.id == assignment.employee_id)
                emp_result = await session.execute(emp_stmt)
                emp = emp_result.scalar_one_or_none()
                emp_name = emp.full_name if emp else None
            
            assigned_by_stmt = select(User).where(User.id == assignment.assigned_by_user_id)
            assigned_by_result = await session.execute(assigned_by_stmt)
            assigned_by_user = assigned_by_result.scalar_one_or_none()
            assigned_by_name = assigned_by_user.full_name if assigned_by_user else (assigned_by_user.email if assigned_by_user else None)
            
            assignment_history.append({
                "id": assignment.id,
                "employee_id": assignment.employee_id,
                "employee_name": emp_name,
                "assigned_by_user_id": assignment.assigned_by_user_id,
                "assigned_by_name": assigned_by_name,
                "notes": assignment.notes,
                "created_at": assignment.created_at
            })
        
        # Convert to response model and add user email, employee info, and history
        booking_dict = {
            **{k: getattr(booking, k) for k in BookingRead.model_fields.keys() if hasattr(booking, k)},
            "user_email": booking_user.email if booking_user else None,
            "assigned_employee_id": booking.assigned_employee_id,
            "assigned_employee_name": assigned_employee_name,
            "employee_assignment_history": assignment_history,
            "daily_work_logs": booking.daily_work_logs or []
        }
        
        return BookingRead(**booking_dict)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"[ERROR] Error getting booking {booking_id}: {str(e)}")
        print(f"[ERROR] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve booking: {str(e)}"
        )


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
    
    # Re-fetch with eager loading to avoid lazy loading issues
    result = await session.execute(
        select(Booking)
        .where(Booking.id == booking.id)
        .options(selectinload(Booking.daily_work_logs))
    )
    booking = result.scalar_one()
    
    # Send email notification to sales team
    try:
        from automex_backend.services.email_service import send_booking_email
        
        # Get service name if available
        service_name = service.name if service else (booking_data.service_name if hasattr(booking_data, 'service_name') else "Custom Service")
        car_brand = booking_data.vehicle_make or booking_data.car_brand or "Not specified"
        car_model = booking_data.vehicle_model or booking_data.car_model or "Not specified"
        fuel_type = booking_data.fuel_type or "Not specified"
        
        await send_booking_email(
            user_name=user.full_name or user.email,
            user_email=user.email,
            user_phone=user.phone_number,
            booking_id=booking.id,
            service_name=service_name,
            car_brand=car_brand,
            car_model=car_model,
            fuel_type=fuel_type,
            booking_date=booking_data.booking_date,
            booking_status=booking.status.value if hasattr(booking.status, 'value') else str(booking.status),
            pickup_address=booking_data.pickup_address,
            special_instructions=booking_data.special_instructions,
            estimated_cost=estimated_cost
        )
    except Exception as email_error:
        # Don't fail the booking creation if email fails
        print(f"[WARNING] Failed to send booking email notification: {str(email_error)}")
        import traceback
        print(f"[WARNING] Email error traceback: {traceback.format_exc()}")
    
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
        print(f"[INFO] Creating service booking for user {user.id}")
        print(f"[INFO] Booking data received: {booking_data.model_dump()}")
        
        # Pydantic automatically parses ISO datetime strings, so booking_data.booking_date is already a datetime
        # Get contact information from user
        contact_name = user.full_name if user.full_name else (user.email if user.email else "User")
        contact_phone = user.phone_number if user.phone_number else None
        
        print(f"[INFO] Contact info: name={contact_name}, phone={contact_phone}")
        print(f"[INFO] Booking date type: {type(booking_data.booking_date)}, value: {booking_data.booking_date}")
        
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
            print(f"[INFO] Added car selection fields: brand={booking_data.car_brand}, model={booking_data.car_model}")
        except Exception as field_error:
            print(f"[WARNING] Could not add car selection fields: {field_error}")
            # Fallback: use vehicle_make/model only
            booking_data_dict.update({
                "vehicle_make": booking_data.car_brand,
                "vehicle_model": booking_data.car_model,
            })
        
        print(f"[INFO] Creating Booking object with data: {booking_data_dict}")
        booking = Booking(**booking_data_dict)
        
        session.add(booking)
        print(f"[INFO] Booking added to session, committing...")
        await session.commit()
        
        # Re-fetch with eager loading to avoid lazy loading issues
        result = await session.execute(
            select(Booking)
            .where(Booking.id == booking.id)
            .options(selectinload(Booking.daily_work_logs))
        )
        booking = result.scalar_one()
        print(f"[INFO] Booking created successfully with ID: {booking.id}")
        
        # Send email notification to sales team
        try:
            from automex_backend.services.email_service import send_booking_email
            
            await send_booking_email(
                user_name=contact_name,
                user_email=user.email,
                user_phone=contact_phone,
                booking_id=booking.id,
                service_name=booking_data.service_name,
                car_brand=booking_data.car_brand,
                car_model=booking_data.car_model,
                fuel_type=booking_data.fuel_type,
                booking_date=booking_data.booking_date,
                booking_status=booking.status.value if hasattr(booking.status, 'value') else str(booking.status),
                pickup_address=booking.pickup_address,
                special_instructions=booking.special_instructions,
                estimated_cost=booking.estimated_cost
            )
        except Exception as email_error:
            # Don't fail the booking creation if email fails
            print(f"[WARNING] Failed to send booking email notification: {str(email_error)}")
            import traceback
            print(f"[WARNING] Email error traceback: {traceback.format_exc()}")
        
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


@router.patch("/{booking_id}/status", response_model=BookingStatusUpdateResponse)
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
        
        # Store old status before updating (for email notification)
        old_status = booking.status
        
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
        
        
        print(f"[DEBUG] Re-fetching booking with eager loading")
        # Re-fetch with eager loading to avoid lazy loading issues
        booking_result = await session.execute(
            select(Booking)
            .where(Booking.id == booking_id)
            .options(selectinload(Booking.daily_work_logs))
        )
        booking = booking_result.scalar_one()
        print(f"[DEBUG] Booking re-fetched, status is now: {booking.status}")
        
        # Get user information for email notification
        user_result = await session.execute(
            select(User).where(User.id == booking.user_id)
        )
        booking_user = user_result.scalar_one_or_none()
        user_email = booking_user.email if booking_user else None
        
        # Send email notification to user about status change
        email_sent = False
        if booking_user and user_email:
            try:
                print(f"[DEBUG] Preparing to send status update email to {user_email}...")
                from automex_backend.services.email_service import send_status_update_email
                
                # Get service name
                service_name = booking.service_name or "Service"
                if booking.service_id:
                    service_result = await session.execute(
                        select(Service).where(Service.id == booking.service_id)
                    )
                    service = service_result.scalar_one_or_none()
                    if service:
                        service_name = service.name
                
                # Get vehicle details
                car_brand = booking.car_brand or booking.vehicle_make or "Not specified"
                car_model = booking.car_model or booking.vehicle_model or "Not specified"
                
                print(f"[DEBUG] Calling send_status_update_email for booking #{booking.id}...")
                email_sent = await send_status_update_email(
                    user_name=booking_user.full_name or booking_user.email,
                    user_email=user_email,
                    booking_id=booking.id,
                    service_name=service_name,
                    car_brand=car_brand,
                    car_model=car_model,
                    old_status=old_status,
                    new_status=status_value,
                    booking_date=booking.booking_date,
                    sender_email="sales@automex.in"
                )
                print(f"[DEBUG] Email send result: {email_sent}")
            except Exception as email_error:
                # Don't fail the status update if email fails
                print(f"[ERROR] Failed to send status update email notification: {str(email_error)}")
                import traceback
                print(f"[ERROR] Email error traceback: {traceback.format_exc()}")
                email_sent = False
        
        # Create response with user email info
        from automex_backend.schemas.booking import BookingStatusUpdateResponse
        
        # Convert booking to response model with email info
        response = BookingStatusUpdateResponse.model_validate(booking)
        response.user_email = user_email
        response.email_sent = email_sent
        
        return response
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
    
    # Re-fetch with eager loading to avoid lazy loading issues
    result = await session.execute(
        select(Booking)
        .where(Booking.id == booking_id)
        .options(selectinload(Booking.daily_work_logs))
    )
    booking = result.scalar_one()
    
    return booking


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(
    booking_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Permanently delete a booking and all related data (Super Admin only)
    This will:
    - Delete all daily work logs
    - Delete all photos and videos from S3
    - Delete the booking record
    """
    # Check if user is Super Admin only
    is_super = await is_super_admin_only(user, session)
    if not is_super:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Super Admin can permanently delete bookings"
        )
    
    # Get booking with all related data
    booking_result = await session.execute(
        select(Booking)
        .where(Booking.id == booking_id)
        .options(selectinload(Booking.daily_work_logs))
    )
    booking = booking_result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Get booking owner's email for S3 deletion
    owner_result = await session.execute(
        select(User).where(User.id == booking.user_id)
    )
    owner = owner_result.scalar_one_or_none()
    owner_email = owner.email if owner else None
    
    # Collect all media URLs from daily work logs
    def extract_urls(items):
        """Extract URLs from photos/videos (handle both string and object formats)"""
        urls = []
        for item in items or []:
            if isinstance(item, str):
                urls.append(item)
            elif isinstance(item, dict) and "url" in item:
                urls.append(item["url"])
        return urls
    
    all_media_urls = []
    date_folders_to_delete = set()
    
    # Process all daily work logs
    if booking.daily_work_logs:
        for daily_log in booking.daily_work_logs:
            # Extract photo URLs
            if daily_log.photos:
                all_media_urls.extend(extract_urls(daily_log.photos))
            
            # Extract video URLs
            if daily_log.videos:
                all_media_urls.extend(extract_urls(daily_log.videos))
            
            # Collect date folders for bulk deletion
            if daily_log.log_date and owner_email:
                date_str = daily_log.log_date.strftime("%Y-%m-%d") if hasattr(daily_log.log_date, 'strftime') else str(daily_log.log_date)
                date_folders_to_delete.add(date_str)
    
    # Delete all media files from S3
    from automex_backend.services.s3 import s3_service
    
    deleted_count = 0
    
    # Delete files by date folder (more efficient)
    if owner_email:
        for date_folder in date_folders_to_delete:
            try:
                count = await s3_service.delete_files_by_date_folder(owner_email, date_folder)
                deleted_count += count
                print(f"[INFO] Deleted {count} files from date folder {date_folder} for booking #{booking_id}")
            except Exception as e:
                print(f"[WARNING] Failed to delete date folder {date_folder}: {str(e)}")
    
    # Delete individual files by URL (in case some weren't in date folders)
    for url in all_media_urls:
        try:
            if await s3_service.delete_file(url):
                deleted_count += 1
        except Exception as e:
            print(f"[WARNING] Failed to delete file {url}: {str(e)}")
    
    print(f"[INFO] Deleted {deleted_count} media files from S3 for booking #{booking_id}")
    
    # Delete all daily work logs from database
    if booking.daily_work_logs:
        for daily_log in booking.daily_work_logs:
            await session.delete(daily_log)
        print(f"[INFO] Deleted {len(booking.daily_work_logs)} daily work log(s) for booking #{booking_id}")
    
    # Delete the booking itself
    await session.delete(booking)
    await session.commit()
    
    print(f"[INFO] Successfully deleted booking #{booking_id} and all related data")
    
    return None


@router.patch("/{booking_id}/cancel", response_model=BookingRead)
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
    
    # Re-fetch with eager loading
    result = await session.execute(
        select(Booking)
        .where(Booking.id == booking_id)
        .options(selectinload(Booking.daily_work_logs))
    )
    booking = result.scalar_one()
    
    return booking


# Daily Work Log endpoints using new DailyWorkLog table

@router.post("/{booking_id}/daily-work-logs", response_model=DailyWorkLogRead, status_code=status.HTTP_201_CREATED)
async def create_daily_work_log(
    booking_id: int,
    log_data: DailyWorkLogCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Create a new daily work log entry (Admin and Super Admin only)
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can create daily work logs"
        )
    
    # Get booking
    result = await session.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if log already exists for this date
    existing_log = await session.execute(
        select(DailyWorkLog).where(
            DailyWorkLog.booking_id == booking_id,
            DailyWorkLog.log_date == log_data.log_date
        )
    )
    if existing_log.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Daily work log already exists for date {log_data.log_date}"
        )
    
    # Create new log entry
    daily_log = DailyWorkLog(
        booking_id=booking_id,
        log_date=log_data.log_date,
        description=log_data.description,
        photos=log_data.photos or [],
        videos=log_data.videos or []
    )
    
    session.add(daily_log)
    await session.commit()
    await session.refresh(daily_log)
    
    # Send email notification to user about work log addition
    try:
        from automex_backend.services.email_service import send_work_log_email
        
        # Get user information
        user_result = await session.execute(
            select(User).where(User.id == booking.user_id)
        )
        booking_user = user_result.scalar_one_or_none()
        
        if booking_user and booking_user.email:
            # Get service name
            service_name = booking.service_name or "Service"
            if booking.service_id:
                service_result = await session.execute(
                    select(Service).where(Service.id == booking.service_id)
                )
                service = service_result.scalar_one_or_none()
                if service:
                    service_name = service.name
            
            # Get vehicle details
            car_brand = booking.car_brand or booking.vehicle_make or "Not specified"
            car_model = booking.car_model or booking.vehicle_model or "Not specified"
            
            # Count photos and videos
            photos_count = len(daily_log.photos) if daily_log.photos else 0
            videos_count = len(daily_log.videos) if daily_log.videos else 0
            
            # Format log date
            log_date_str = daily_log.log_date.strftime("%B %d, %Y") if hasattr(daily_log.log_date, 'strftime') else str(daily_log.log_date)
            
            await send_work_log_email(
                user_name=booking_user.full_name or booking_user.email,
                user_email=booking_user.email,
                booking_id=booking.id,
                service_name=service_name,
                car_brand=car_brand,
                car_model=car_model,
                log_date=log_date_str,
                description=daily_log.description,
                photos_count=photos_count,
                videos_count=videos_count,
                sender_email="sales@automex.in"
            )
    except Exception as email_error:
        # Don't fail the work log creation if email fails
        print(f"[WARNING] Failed to send work log email notification: {str(email_error)}")
        import traceback
        print(f"[WARNING] Email error traceback: {traceback.format_exc()}")
    
    return daily_log


@router.patch("/{booking_id}/daily-work-logs/{log_id}/description", response_model=DailyWorkLogRead)
async def update_daily_work_log_description(
    booking_id: int,
    log_id: int,
    description_update: DailyWorkLogDescriptionUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update daily work log description (Admin and Super Admin only)
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can update daily work log description"
        )
    
    # Get log entry
    result = await session.execute(
        select(DailyWorkLog).where(
            DailyWorkLog.id == log_id,
            DailyWorkLog.booking_id == booking_id
        )
    )
    daily_log = result.scalar_one_or_none()
    
    if not daily_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Daily work log not found"
        )
    
    # Update description
    daily_log.description = description_update.description
    await session.commit()
    await session.refresh(daily_log)
    
    return daily_log


@router.post("/{booking_id}/daily-work-logs/{log_date}/media", response_model=DailyWorkLogRead)
async def upload_daily_work_media(
    booking_id: int,
    log_date: str,
    files: List[UploadFile] = File(...),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Upload photos or videos for a specific date's daily work log (Admin and Super Admin only)
    Accepts multiple files. Automatically categorizes as photos or videos based on content type.
    Creates log entry if it doesn't exist for the date.
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can upload daily work media"
        )
    
    # Validate date format
    try:
        date_obj = datetime.strptime(log_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    # Get booking
    result = await session.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Get booking owner's email for folder structure
    owner_result = await session.execute(
        select(User).where(User.id == booking.user_id)
    )
    owner = owner_result.scalar_one_or_none()
    owner_email = owner.email if owner else None
    
    if not owner_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking owner email not found"
        )
    
    # Validate files
    if not files or len(files) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one file must be uploaded"
        )
    
    # Get or create daily work log for this date
    log_result = await session.execute(
        select(DailyWorkLog).where(
            DailyWorkLog.booking_id == booking_id,
            DailyWorkLog.log_date == date_obj
        )
    )
    daily_log = log_result.scalar_one_or_none()
    
    if not daily_log:
        # Create new log entry
        daily_log = DailyWorkLog(
            booking_id=booking_id,
            log_date=date_obj,
            description=None,
            photos=[],
            videos=[]
        )
        session.add(daily_log)
        await session.flush()  # Flush to get the ID
    
    # Initialize lists if None
    if daily_log.photos is None:
        daily_log.photos = []
    if daily_log.videos is None:
        daily_log.videos = []
    
    # Upload files and categorize
    from automex_backend.services.s3 import s3_service
    
    uploaded_photos = []
    uploaded_videos = []
    
    for file in files:
        # Validate file type
        if not file.content_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File {file.filename} has no content type"
            )
        
        # Validate file size (max 50MB for videos, 10MB for images)
        file_content = await file.read()
        file_size = len(file_content)
        await file.seek(0)  # Reset file pointer
        
        if file.content_type.startswith('image/'):
            if file_size > 10 * 1024 * 1024:  # 10MB
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Image {file.filename} exceeds 10MB limit"
                )
            # Upload image with date folder
            image_url = await s3_service.upload_file(file, booking_email=owner_email, date_folder=log_date)
            uploaded_photos.append(image_url)
        elif file.content_type.startswith('video/'):
            if file_size > 50 * 1024 * 1024:  # 50MB
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Video {file.filename} exceeds 50MB limit"
                )
            # Upload video with date folder
            video_url = await s3_service.upload_file(file, booking_email=owner_email, date_folder=log_date)
            uploaded_videos.append(video_url)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File {file.filename} must be an image or video"
            )
    
    # Update log with new media URLs (store as objects with date and url)
    # Handle both old format (strings) and new format (objects)
    existing_photos = daily_log.photos or []
    existing_videos = daily_log.videos or []
    
    # Use date_obj (already parsed) - it's a date object, so use isoformat()
    # log_date is the original string parameter, date_obj is the parsed date object
    date_str = date_obj.isoformat()
    
    # Convert existing strings to objects if needed
    if existing_photos and isinstance(existing_photos[0], str):
        existing_photos = [{"date": date_str, "url": url} for url in existing_photos]
    if existing_videos and isinstance(existing_videos[0], str):
        existing_videos = [{"date": date_str, "url": url} for url in existing_videos]
    
    # Add new media as objects
    new_photos = [{"date": date_str, "url": url} for url in uploaded_photos]
    new_videos = [{"date": date_str, "url": url} for url in uploaded_videos]
    
    daily_log.photos = existing_photos + new_photos
    daily_log.videos = existing_videos + new_videos
    
    await session.commit()
    await session.refresh(daily_log)
    
    # Send email notification to user about media upload
    try:
        from automex_backend.services.email_service import send_work_log_email
        
        if owner and owner.email:
            # Get service name
            service_name = booking.service_name or "Service"
            if booking.service_id:
                service_result = await session.execute(
                    select(Service).where(Service.id == booking.service_id)
                )
                service = service_result.scalar_one_or_none()
                if service:
                    service_name = service.name
            
            # Get vehicle details
            car_brand = booking.car_brand or booking.vehicle_make or "Not specified"
            car_model = booking.car_model or booking.vehicle_model or "Not specified"
            
            # Count photos and videos
            photos_count = len(daily_log.photos) if daily_log.photos else 0
            videos_count = len(daily_log.videos) if daily_log.videos else 0
            
            # Format log date
            log_date_str = daily_log.log_date.strftime("%B %d, %Y") if hasattr(daily_log.log_date, 'strftime') else str(daily_log.log_date)
            
            await send_work_log_email(
                user_name=owner.full_name or owner.email,
                user_email=owner.email,
                booking_id=booking.id,
                service_name=service_name,
                car_brand=car_brand,
                car_model=car_model,
                log_date=log_date_str,
                description=daily_log.description,
                photos_count=photos_count,
                videos_count=videos_count,
                sender_email="sales@automex.in"
            )
    except Exception as email_error:
        # Don't fail the media upload if email fails
        print(f"[WARNING] Failed to send work log email notification: {str(email_error)}")
        import traceback
        print(f"[WARNING] Email error traceback: {traceback.format_exc()}")
    
    return daily_log


@router.delete("/{booking_id}/daily-work-logs/{log_id}/media", response_model=DailyWorkLogRead)
async def delete_daily_work_media(
    booking_id: int,
    log_id: int,
    media_url: str = Query(..., description="URL of the media file to delete"),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete a photo or video from daily work log (Admin and Super Admin only)
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can delete daily work media"
        )
    
    # Get log entry
    result = await session.execute(
        select(DailyWorkLog).where(
            DailyWorkLog.id == log_id,
            DailyWorkLog.booking_id == booking_id
        )
    )
    daily_log = result.scalar_one_or_none()
    
    if not daily_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Daily work log not found"
        )
    
    # Initialize lists if None
    if daily_log.photos is None:
        daily_log.photos = []
    if daily_log.videos is None:
        daily_log.videos = []
    
    # Remove media URL from appropriate list (handle both string and object formats)
    def matches_url(item, url):
        if isinstance(item, str):
            return item == url
        elif isinstance(item, dict) and "url" in item:
            return item["url"] == url
        return False
    
    photos_list = [p for p in (daily_log.photos or []) if not matches_url(p, media_url)]
    videos_list = [v for v in (daily_log.videos or []) if not matches_url(v, media_url)]
    
    media_found = len(photos_list) != len(daily_log.photos) or len(videos_list) != len(daily_log.videos)
    
    if not media_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media file not found in daily work log"
        )
    
    # Update lists
    daily_log.photos = photos_list
    daily_log.videos = videos_list
    
    # Delete from S3
    from automex_backend.services.s3 import s3_service
    await s3_service.delete_file(media_url)
    
    await session.commit()
    await session.refresh(daily_log)
    
    return daily_log


@router.delete("/{booking_id}/daily-work-logs/{log_date}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_daily_work_by_date(
    booking_id: int,
    log_date: str,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete all daily work log for a specific date (Admin and Super Admin only)
    Deletes from both database and S3
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can delete daily work logs by date"
        )
    
    # Validate date format
    try:
        date_obj = datetime.strptime(log_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    # Get booking
    result = await session.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Get daily work log for this date
    log_result = await session.execute(
        select(DailyWorkLog).where(
            DailyWorkLog.booking_id == booking_id,
            DailyWorkLog.log_date == date_obj
        )
    )
    daily_log = log_result.scalar_one_or_none()
    
    if not daily_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No daily work log found for date {log_date}"
        )
    
    # Get booking owner's email for S3 deletion
    owner_result = await session.execute(
        select(User).where(User.id == booking.user_id)
    )
    owner = owner_result.scalar_one_or_none()
    owner_email = owner.email if owner else None
    
    if not owner_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking owner email not found"
        )
    
    # Collect all media URLs to delete from S3
    # Extract URLs from photos and videos (handle both string and object formats)
    def extract_urls(items):
        urls = []
        for item in items or []:
            if isinstance(item, str):
                urls.append(item)
            elif isinstance(item, dict) and "url" in item:
                urls.append(item["url"])
        return urls
    
    urls_to_delete = []
    if daily_log.photos:
        urls_to_delete.extend(extract_urls(daily_log.photos))
    if daily_log.videos:
        urls_to_delete.extend(extract_urls(daily_log.videos))
    
    # Delete from S3
    from automex_backend.services.s3 import s3_service
    s3_deleted_count = await s3_service.delete_files_by_date_folder(owner_email, log_date)
    
    # Also delete individual files by URL (in case some weren't in the date folder)
    for url in urls_to_delete:
        await s3_service.delete_file(url)
    
    # Delete the log entry from database
    await session.delete(daily_log)
    await session.commit()
    
    print(f"[INFO] Deleted daily work log for date {log_date} ({len(urls_to_delete)} media items, S3 deleted: {s3_deleted_count} files)")
    
    return None


@router.patch("/{booking_id}/assign-employee", response_model=BookingRead)
async def assign_employee_to_booking(
    booking_id: int,
    assignment: BookingEmployeeAssignmentCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Assign or change employee assignment for a booking (Super Admin only)
    """
    # Check if user is super admin
    is_super = await is_super_admin_only(user, session)
    if not is_super:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admin can assign employees to bookings"
        )
    
    # Get booking
    result = await session.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Validate employee if provided
    if assignment.employee_id is not None:
        from automex_backend.models.employee import Employee
        emp_result = await session.execute(
            select(Employee).where(Employee.id == assignment.employee_id)
        )
        employee = emp_result.scalar_one_or_none()
        
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        if not employee.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot assign inactive employee"
            )
    
    # Update booking assignment
    old_employee_id = booking.assigned_employee_id
    booking.assigned_employee_id = assignment.employee_id
    await session.commit()
    await session.refresh(booking)
    
    # Create assignment history record
    from automex_backend.models.booking_employee_assignment import BookingEmployeeAssignment
    assignment_history = BookingEmployeeAssignment(
        booking_id=booking.id,
        employee_id=assignment.employee_id,
        assigned_by_user_id=user.id,
        notes=assignment.notes
    )
    session.add(assignment_history)
    await session.commit()
    
    # Reload booking with relationships
    result = await session.execute(
        select(Booking)
        .where(Booking.id == booking_id)
        .options(selectinload(Booking.daily_work_logs))
    )
    booking = result.scalar_one_or_none()
    
    # Load user email
    user_stmt = select(User).where(User.id == booking.user_id)
    user_result = await session.execute(user_stmt)
    booking_user = user_result.scalar_one_or_none()
    
    # Load assigned employee info
    assigned_employee_name = None
    if booking.assigned_employee_id:
        from automex_backend.models.employee import Employee
        emp_stmt = select(Employee).where(Employee.id == booking.assigned_employee_id)
        emp_result = await session.execute(emp_stmt)
        employee = emp_result.scalar_one_or_none()
        assigned_employee_name = employee.full_name if employee else None
    
    # Load employee assignment history
    assignment_stmt = select(BookingEmployeeAssignment).where(
        BookingEmployeeAssignment.booking_id == booking.id
    ).order_by(BookingEmployeeAssignment.created_at.desc())
    assignment_result = await session.execute(assignment_stmt)
    assignments = assignment_result.scalars().all()
    
    # Build assignment history
    assignment_history_list = []
    for assgn in assignments:
        emp_name = None
        if assgn.employee_id:
            emp_stmt = select(Employee).where(Employee.id == assgn.employee_id)
            emp_result = await session.execute(emp_stmt)
            emp = emp_result.scalar_one_or_none()
            emp_name = emp.full_name if emp else None
        
        assigned_by_stmt = select(User).where(User.id == assgn.assigned_by_user_id)
        assigned_by_result = await session.execute(assigned_by_stmt)
        assigned_by_user = assigned_by_result.scalar_one_or_none()
        assigned_by_name = assigned_by_user.full_name if assigned_by_user else (assigned_by_user.email if assigned_by_user else None)
        
        assignment_history_list.append({
            "id": assgn.id,
            "employee_id": assgn.employee_id,
            "employee_name": emp_name,
            "assigned_by_user_id": assgn.assigned_by_user_id,
            "assigned_by_name": assigned_by_name,
            "notes": assgn.notes,
            "created_at": assgn.created_at
        })
    
    # Convert to response model
    booking_dict = {
        **{k: getattr(booking, k) for k in BookingRead.model_fields.keys() if hasattr(booking, k)},
        "user_email": booking_user.email if booking_user else None,
        "assigned_employee_id": booking.assigned_employee_id,
        "assigned_employee_name": assigned_employee_name,
        "employee_assignment_history": assignment_history_list,
        "daily_work_logs": booking.daily_work_logs or []
    }
    
    return BookingRead(**booking_dict)

