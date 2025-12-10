"""
Extra Services API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.extra_service import ExtraService
from automex_backend.models.user import User
from automex_backend.models.employee import Employee
from automex_backend.schemas.extra_service import ExtraServiceRead, ExtraServiceCreate, ExtraServiceUpdate
from automex_backend.api.auth import current_active_user
from automex_backend.api.bookings import is_admin_or_super_admin

router = APIRouter()


@router.get("/", response_model=List[ExtraServiceRead])
async def get_extra_services(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Get list of extra services (Admin and Super Admin only)
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can access extra services"
        )
    
    query = select(ExtraService).order_by(desc(ExtraService.created_at))
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    extra_services = result.scalars().all()
    
    # Load created_by and assigned_employee names
    user_ids = {service.created_by_user_id for service in extra_services}
    employee_ids = {service.assigned_employee_id for service in extra_services if service.assigned_employee_id}
    
    users = {}
    if user_ids:
        users_stmt = select(User).where(User.id.in_(user_ids))
        users_result = await session.execute(users_stmt)
        users = {u.id: u.full_name or u.email for u in users_result.scalars().all()}
    
    employees = {}
    if employee_ids:
        emp_stmt = select(Employee).where(Employee.id.in_(employee_ids))
        emp_result = await session.execute(emp_stmt)
        employees = {e.id: e.full_name for e in emp_result.scalars().all()}
    
    # Convert to response models
    service_list = []
    for service in extra_services:
        service_dict = {
            **{k: getattr(service, k) for k in ExtraServiceRead.model_fields.keys() if hasattr(service, k)},
            "created_by_name": users.get(service.created_by_user_id),
            "assigned_employee_name": employees.get(service.assigned_employee_id) if service.assigned_employee_id else None,
        }
        service_list.append(ExtraServiceRead(**service_dict))
    
    return service_list


@router.post("/", response_model=ExtraServiceRead, status_code=status.HTTP_201_CREATED)
async def create_extra_service(
    service_data: ExtraServiceCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Create a new extra service (Admin and Super Admin only)
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can create extra services"
        )
    
    # Validate assigned employee if provided
    if service_data.assigned_employee_id:
        emp_result = await session.execute(
            select(Employee).where(Employee.id == service_data.assigned_employee_id)
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
    
    # Create extra service
    extra_service = ExtraService(
        service_name=service_data.service_name,
        vehicle_name=service_data.vehicle_name,
        assigned_employee_id=service_data.assigned_employee_id,
        price=service_data.price,
        owner_details=service_data.owner_details,
        service_description=service_data.service_description,
        created_by_user_id=user.id
    )
    
    session.add(extra_service)
    await session.commit()
    await session.refresh(extra_service)
    
    # Load created_by and assigned_employee names
    created_by_name = user.full_name or user.email
    assigned_employee_name = None
    if extra_service.assigned_employee_id:
        emp_result = await session.execute(
            select(Employee).where(Employee.id == extra_service.assigned_employee_id)
        )
        employee = emp_result.scalar_one_or_none()
        assigned_employee_name = employee.full_name if employee else None
    
    service_dict = {
        **{k: getattr(extra_service, k) for k in ExtraServiceRead.model_fields.keys() if hasattr(extra_service, k)},
        "created_by_name": created_by_name,
        "assigned_employee_name": assigned_employee_name,
    }
    
    return ExtraServiceRead(**service_dict)


@router.patch("/{service_id}", response_model=ExtraServiceRead)
async def update_extra_service(
    service_id: int,
    service_data: ExtraServiceUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update an extra service (Admin and Super Admin only)
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can update extra services"
        )
    
    # Get extra service
    result = await session.execute(
        select(ExtraService).where(ExtraService.id == service_id)
    )
    extra_service = result.scalar_one_or_none()
    
    if not extra_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Extra service not found"
        )
    
    # Validate assigned employee if provided
    if service_data.assigned_employee_id is not None:
        if service_data.assigned_employee_id:
            emp_result = await session.execute(
                select(Employee).where(Employee.id == service_data.assigned_employee_id)
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
    
    # Update fields
    update_data = service_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(extra_service, field, value)
    
    await session.commit()
    await session.refresh(extra_service)
    
    # Load created_by and assigned_employee names
    created_by_result = await session.execute(
        select(User).where(User.id == extra_service.created_by_user_id)
    )
    created_by_user = created_by_result.scalar_one_or_none()
    created_by_name = created_by_user.full_name if created_by_user else (created_by_user.email if created_by_user else None)
    
    assigned_employee_name = None
    if extra_service.assigned_employee_id:
        emp_result = await session.execute(
            select(Employee).where(Employee.id == extra_service.assigned_employee_id)
        )
        employee = emp_result.scalar_one_or_none()
        assigned_employee_name = employee.full_name if employee else None
    
    service_dict = {
        **{k: getattr(extra_service, k) for k in ExtraServiceRead.model_fields.keys() if hasattr(extra_service, k)},
        "created_by_name": created_by_name,
        "assigned_employee_name": assigned_employee_name,
    }
    
    return ExtraServiceRead(**service_dict)


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_extra_service(
    service_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete an extra service (Admin and Super Admin only)
    """
    # Check if user is Admin or Super Admin
    is_admin = await is_admin_or_super_admin(user, session)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Super Admin can delete extra services"
        )
    
    # Get extra service
    result = await session.execute(
        select(ExtraService).where(ExtraService.id == service_id)
    )
    extra_service = result.scalar_one_or_none()
    
    if not extra_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Extra service not found"
        )
    
    await session.delete(extra_service)
    await session.commit()
    
    return None

