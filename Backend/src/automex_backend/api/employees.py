"""
Employees API routes - Super Admin only
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.employee import Employee
from automex_backend.models.user import User
from automex_backend.schemas.employee import EmployeeRead, EmployeeCreate, EmployeeUpdate
from automex_backend.api.auth import current_active_user, get_current_user_with_role

router = APIRouter()


async def is_super_admin(user: User, session: AsyncSession) -> bool:
    """Check if user is super admin"""
    if user.is_superuser:
        return True
    
    if hasattr(user, 'role_id') and user.role_id:
        from automex_backend.models.role import Role
        role_stmt = select(Role).where(Role.id == user.role_id)
        role_result = await session.execute(role_stmt)
        role = role_result.scalar_one_or_none()
        if role and role.name == "super":
            return True
    
    return False


@router.get("/", response_model=List[EmployeeRead])
async def get_employees(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user_with_role)
):
    """
    Get all employees.
    Only accessible to super admin.
    """
    if not await is_super_admin(user, session):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Super Admin role required."
        )
    
    result = await session.execute(
        select(Employee).order_by(Employee.created_at.desc())
    )
    employees = result.scalars().all()
    return employees


@router.get("/{employee_id}", response_model=EmployeeRead)
async def get_employee(
    employee_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user_with_role)
):
    """
    Get a specific employee by ID.
    Only accessible to super admin.
    """
    if not await is_super_admin(user, session):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Super Admin role required."
        )
    
    result = await session.execute(
        select(Employee).where(Employee.id == employee_id)
    )
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    return employee


@router.post("/", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee_data: EmployeeCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user_with_role)
):
    """
    Create a new employee.
    Only accessible to super admin.
    """
    try:
        if not await is_super_admin(user, session):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Super Admin role required."
            )
        
        # Check if email already exists
        existing_email = await session.execute(
            select(Employee).where(Employee.email == employee_data.email)
        )
        if existing_email.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee with this email already exists"
            )
        
        # Check if phone number already exists (if provided)
        if employee_data.phone_number:
            existing_phone = await session.execute(
                select(Employee).where(Employee.phone_number == employee_data.phone_number)
            )
            if existing_phone.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Employee with this phone number already exists"
                )
        
        # Check if employee_id already exists (if provided)
        if employee_data.employee_id:
            existing_emp_id = await session.execute(
                select(Employee).where(Employee.employee_id == employee_data.employee_id)
            )
            if existing_emp_id.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Employee with this employee ID already exists"
                )
        
        # Create new employee
        # Convert Pydantic model to dict and ensure None values for empty strings
        employee_dict = employee_data.model_dump(exclude_unset=False)
        
        # Ensure created_by_user_id is set
        employee_dict['created_by_user_id'] = user.id
        
        # Create employee instance
        employee = Employee(**employee_dict)
        
        session.add(employee)
        await session.commit()
        await session.refresh(employee)
        
        return employee
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[ERROR] Error creating employee: {str(e)}")
        print(f"[ERROR] Traceback:\n{error_trace}")
        print(f"[ERROR] Employee data: {employee_data.model_dump() if hasattr(employee_data, 'model_dump') else 'N/A'}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create employee: {str(e)}"
        )


@router.patch("/{employee_id}", response_model=EmployeeRead)
async def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user_with_role)
):
    """
    Update an employee.
    Only accessible to super admin.
    """
    if not await is_super_admin(user, session):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Super Admin role required."
        )
    
    result = await session.execute(
        select(Employee).where(Employee.id == employee_id)
    )
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Check if email is being updated and if it's already taken
    if employee_data.email and employee_data.email != employee.email:
        existing_email = await session.execute(
            select(Employee).where(
                Employee.email == employee_data.email,
                Employee.id != employee_id
            )
        )
        if existing_email.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee with this email already exists"
            )
    
    # Check if phone number is being updated and if it's already taken
    if employee_data.phone_number and employee_data.phone_number != employee.phone_number:
        existing_phone = await session.execute(
            select(Employee).where(
                Employee.phone_number == employee_data.phone_number,
                Employee.id != employee_id
            )
        )
        if existing_phone.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee with this phone number already exists"
            )
    
    # Check if employee_id is being updated and if it's already taken
    if employee_data.employee_id and employee_data.employee_id != employee.employee_id:
        existing_emp_id = await session.execute(
            select(Employee).where(
                Employee.employee_id == employee_data.employee_id,
                Employee.id != employee_id
            )
        )
        if existing_emp_id.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee with this employee ID already exists"
            )
    
    # Update employee fields
    update_data = employee_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(employee, key, value)
    
    await session.commit()
    await session.refresh(employee)
    
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user_with_role)
):
    """
    Delete an employee.
    Only accessible to super admin.
    """
    if not await is_super_admin(user, session):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Super Admin role required."
        )
    
    result = await session.execute(
        select(Employee).where(Employee.id == employee_id)
    )
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    await session.delete(employee)
    await session.commit()
    
    return None

