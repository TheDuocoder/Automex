"""
Service management API routes
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.database import get_async_session
from automex_backend.models.service import Service, ServiceCategory
from automex_backend.schemas.service import ServiceRead, ServiceCreate, ServiceUpdate
from automex_backend.api.auth import current_active_user
from automex_backend.models.user import User

router = APIRouter()


@router.get("/", response_model=List[ServiceRead])
async def get_services(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[ServiceCategory] = None,
    is_active: bool = True,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get list of services with optional filtering
    """
    query = select(Service).where(Service.is_active == is_active)
    
    if category:
        query = query.where(Service.category == category)
    
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    services = result.scalars().all()
    
    return services


@router.get("/{service_id}", response_model=ServiceRead)
async def get_service(
    service_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a specific service by ID
    """
    result = await session.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    return service


@router.post("/", response_model=ServiceRead, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Create a new service (requires authentication)
    """
    # Only superusers can create services
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create services"
        )
    
    service = Service(**service_data.model_dump())
    session.add(service)
    await session.commit()
    await session.refresh(service)
    
    return service


@router.put("/{service_id}", response_model=ServiceRead)
async def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Update an existing service (requires authentication)
    """
    # Only superusers can update services
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update services"
        )
    
    result = await session.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Update service fields
    for field, value in service_data.model_dump(exclude_unset=True).items():
        setattr(service, field, value)
    
    await session.commit()
    await session.refresh(service)
    
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Delete a service (requires authentication)
    """
    # Only superusers can delete services
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete services"
        )
    
    result = await session.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    await session.delete(service)
    await session.commit()
    
    return None

