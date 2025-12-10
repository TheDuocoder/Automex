"""
Pick Up Requests API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.pickup_request import PickUpRequest
from automex_backend.models.car import Car
from automex_backend.models.user import User
from automex_backend.schemas.pickup_request import PickUpRequestRead, PickUpRequestCreate, PickUpRequestUpdate
from automex_backend.api.auth import current_active_user, get_current_user_with_role

router = APIRouter()


async def check_is_admin_or_super(user: User, session: AsyncSession) -> bool:
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


from sqlalchemy.orm import selectinload

@router.get("/", response_model=List[PickUpRequestRead])
async def get_pickup_requests(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get list of pickup requests.
    - Admins: View all requests with user and car details
    - Users: View only their own requests
    """
    is_admin = await check_is_admin_or_super(user, session)
    
    query = select(PickUpRequest)
    
    if not is_admin:
        query = query.where(PickUpRequest.user_id == user.id)

    # Always load relations required by schema
    query = query.options(
        selectinload(PickUpRequest.car).selectinload(Car.user).selectinload(User.role),
        selectinload(PickUpRequest.user).selectinload(User.role)
    )
        
    query = query.order_by(PickUpRequest.scheduled_date.desc())
    result = await session.execute(query)
    return result.scalars().all()


@router.get("/{pickup_id}", response_model=PickUpRequestRead)
async def get_pickup_request(
    pickup_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get a single pickup request by ID
    Users can only view their own requests, admins can view all
    """
    query = select(PickUpRequest).where(PickUpRequest.id == pickup_id).options(
        selectinload(PickUpRequest.car).selectinload(Car.user).selectinload(User.role),
        selectinload(PickUpRequest.user).selectinload(User.role)
    )
    result = await session.execute(query)
    request = result.scalar_one_or_none()
    
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pickup request not found")
    
    # Check if user owns the request or is admin/super
    user_with_role = await get_current_user_with_role(user, session)
    is_admin = await check_is_admin_or_super(user_with_role, session)
    
    if request.user_id != user.id and not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this pickup request")
    
    return request


@router.post("/", response_model=PickUpRequestRead, status_code=status.HTTP_201_CREATED)
async def create_pickup_request(
    request_data: PickUpRequestCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Create a new pickup request
    """
    # Verify car belongs to user
    car_query = select(Car).where(Car.id == request_data.car_id, Car.user_id == user.id)
    car_result = await session.execute(car_query)
    if not car_result.scalar_one_or_none():
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

    request = PickUpRequest(**request_data.model_dump(), user_id=user.id)
    session.add(request)
    await session.commit()
    await session.refresh(request, ['car', 'user'])
    
    # Load nested relationships
    await session.refresh(request.car, ['user'])
    if request.car.user:
        await session.refresh(request.car.user, ['role'])
    await session.refresh(request.user, ['role'])
    
    return request


@router.patch("/{pickup_id}", response_model=PickUpRequestRead)
async def update_pickup_request(
    pickup_id: int,
    request_data: PickUpRequestUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update pickup request status and admin comment
    Only ADMIN and SUPER_ADMIN can update status and add comments
    """
    # Get the pickup request first to check ownership
    query = select(PickUpRequest).where(PickUpRequest.id == pickup_id)
    result = await session.execute(query)
    request = result.scalar_one_or_none()
    
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pickup request not found")

    # Get user with role
    user_with_role = await get_current_user_with_role(user, session)
    
    # Check if user is admin or super admin
    is_admin = await check_is_admin_or_super(user_with_role, session)
    is_owner = request.user_id == user.id
    
    if not is_admin and not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this pickup request"
        )
    
    # Update fields based on role
    update_data = request_data.model_dump(exclude_unset=True)
    allowed_updates = {}
    
    if is_admin:
        # Admin can update ALL fields (status, comment, pickup_time, and details)
        allowed_updates.update(update_data)
        
    elif is_owner:
        # Owner can update details but NOT status/admin_comment/pickup_time/drop_time
        # Fields: address, location, latitude, longitude, scheduled_date, car_id
        owner_fields = ['address', 'location', 'latitude', 'longitude', 'scheduled_date', 'car_id']
        for field in owner_fields:
            if field in update_data:
                allowed_updates[field] = update_data[field]
        # Explicitly exclude pickup_time and drop_time from owner updates
        if 'pickup_time' in update_data:
            del update_data['pickup_time']
        if 'drop_time' in update_data:
            del update_data['drop_time']

    # Apply updates
    for field, value in allowed_updates.items():
        setattr(request, field, value)
    
    await session.commit()
    await session.refresh(request, ['car', 'user'])
    
    # Load nested relationships
    await session.refresh(request.car, ['user'])
    if request.car.user:
        await session.refresh(request.car.user, ['role'])
    await session.refresh(request.user, ['role'])
    
    return request


@router.delete("/{pickup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pickup_request(
    pickup_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete a pickup request
    Only ADMIN and SUPER_ADMIN can delete requests
    """
    # Get the pickup request
    query = select(PickUpRequest).where(PickUpRequest.id == pickup_id)
    result = await session.execute(query)
    request = result.scalar_one_or_none()
    
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pickup request not found")

    # Get user with role
    user_with_role = await get_current_user_with_role(user, session)
    
    # Check if user is admin or super admin
    is_admin = await check_is_admin_or_super(user_with_role, session)
    
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this pickup request"
        )
    
    await session.delete(request)
    await session.commit()
    return None
