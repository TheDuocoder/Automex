"""
Authentication routes using FastAPI Users
"""
import os
import traceback
from typing import Optional, List
from fastapi import APIRouter, Depends, Request, HTTPException, status, File, UploadFile, BackgroundTasks
from pydantic import BaseModel, EmailStr
from fastapi_users import FastAPIUsers, BaseUserManager, IntegerIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from automex_backend.config import settings
from automex_backend.database import get_async_session
from automex_backend.models.user import User
from automex_backend.schemas.user import UserRead, UserCreate, UserUpdate
from automex_backend.schemas.role import RoleRead
from automex_backend.services.email_service import email_service

router = APIRouter()


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    """User manager for handling user operations"""
    reset_password_token_secret = settings.SECRET_KEY
    verification_token_secret = settings.SECRET_KEY
    
    # Store token for development mode
    _last_reset_token: Optional[str] = None
    _last_reset_user_id: Optional[int] = None

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"[INFO] User {user.id} has registered: {user.email} with role_id: {user.role_id}")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"[INFO] User {user.id} has forgot their password. Reset token: {token}")
        # Store token for development mode access
        self._last_reset_token = token
        self._last_reset_user_id = user.id

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"[INFO] Verification requested for user {user.id}. Verification token: {token}")
    
    async def create(self, user_create, safe: bool = False, request: Optional[Request] = None):
        """Create a new user with default role"""
        # Call the parent create method
        user = await super().create(user_create, safe=safe, request=request)
        
        # Reload user with role relationship to avoid lazy loading issues
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        
        result = await self.user_db.session.execute(
            select(User).where(User.id == user.id).options(selectinload(User.role))
        )
        user_with_role = result.scalar_one()
        
        return user_with_role


# Bearer token transport
# Use full path for token URL so Swagger UI can find it
bearer_transport = BearerTransport(tokenUrl="/api/v1/auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    """Get JWT strategy for authentication"""
    return JWTStrategy(
        secret=settings.SECRET_KEY,
        lifetime_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


# Authentication backend
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    """Get user database dependency"""
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    """Get user manager dependency"""
    yield UserManager(user_db)


# FastAPI Users instance
fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

# Get current active user dependency
current_active_user = fastapi_users.current_user(active=True)


# Custom dependency to get user with role loaded - returns User (SQLAlchemy model)
# This is used in endpoints that need to work with the database
async def get_current_user_with_role(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
) -> User:
    """Get current user with role relationship loaded - returns SQLAlchemy User"""
    from sqlalchemy import select
    from sqlalchemy.orm import joinedload
    
    try:
        # Query user with role relationship eagerly loaded using joinedload
        stmt = select(User).where(User.id == user.id).options(joinedload(User.role))
        result = await session.execute(stmt)
        user_with_role = result.unique().scalar_one_or_none()
        
        if not user_with_role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Access role to ensure it's loaded
        if not user_with_role.role:
            from automex_backend.models.role import Role
            role_stmt = select(Role).where(Role.id == user_with_role.role_id)
            role_result = await session.execute(role_stmt)
            role_obj = role_result.scalar_one_or_none()
            
            if not role_obj:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="User role not found. Please contact support."
                )
            user_with_role.role = role_obj
        
        return user_with_role
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[ERROR] Error in get_current_user_with_role: {str(e)}")
        print(f"[ERROR] User ID: {user.id if user else 'None'}")
        print(f"[ERROR] Traceback:\n{error_trace}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user details: {str(e)}"
        )


# Custom dependency to get user with role loaded - returns UserRead (Pydantic model)
# This is used in endpoints that return user data to avoid lazy loading issues
async def get_current_user_with_role_read(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
) -> UserRead:
    """Get current user with role relationship loaded and return as UserRead"""
    from sqlalchemy import select
    from sqlalchemy.orm import joinedload
    
    try:
        # Query user with role relationship eagerly loaded using joinedload
        # joinedload loads in the same query, avoiding lazy loading issues
        stmt = select(User).where(User.id == user.id).options(joinedload(User.role))
        result = await session.execute(stmt)
        user_with_role = result.unique().scalar_one_or_none()
        
        if not user_with_role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # CRITICAL: Access and materialize the role relationship while in async context
        role_obj = user_with_role.role
        
        if not role_obj:
            # If role wasn't loaded, load it manually
            from automex_backend.models.role import Role
            role_stmt = select(Role).where(Role.id == user_with_role.role_id)
            role_result = await session.execute(role_stmt)
            role_obj = role_result.scalar_one_or_none()
            
            if not role_obj:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="User role not found. Please contact support."
                )
        
        # CRITICAL: Access all attributes while still in async context
        # Extract all values into plain Python types to force materialization
        from automex_backend.schemas.user import UserRead
        from automex_backend.schemas.role import RoleRead
        
        # Create RoleRead object from plain data to avoid SQLAlchemy relationship access
        role_read = RoleRead(
            id=role_obj.id,
            name=role_obj.name,
            description=role_obj.description
        )
        
        # Build the response manually to avoid relationship access issues
        # All data is extracted into plain Python types while still in async context
        user_dict = {
            "id": user_with_role.id,
            "email": user_with_role.email,
            "is_active": user_with_role.is_active,
            "is_superuser": user_with_role.is_superuser,
            "is_verified": user_with_role.is_verified,
            "full_name": user_with_role.full_name,
            "phone_number": user_with_role.phone_number,
            "role_id": user_with_role.role_id,
            "role": role_read  # Use the Pydantic object directly
        }

        # Create the response object - all data is now plain Python types
        # No SQLAlchemy relationships will be accessed
        return UserRead(**user_dict)

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[ERROR] Error in get_current_user_with_role: {str(e)}")
        print(f"[ERROR] User ID: {user.id if user else 'None'}")
        print(f"[ERROR] Traceback:\n{error_trace}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user details: {str(e)}"
        )


# Include auth routes
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt"
)

# Custom register endpoint that doesn't require authentication
@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED, name="auth:register")
async def register(
    user_create: UserCreate,
    background_tasks: BackgroundTasks,
    user_manager: UserManager = Depends(get_user_manager),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Register a new user (public endpoint - no authentication required)

    This endpoint allows users to create a new account without being authenticated.
    Validates that email and phone_number are unique.
    """
    try:
        # Check if email already exists
        existing_user_by_email = await user_manager.user_db.get_by_email(user_create.email)
        if existing_user_by_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists. Please use a different email or try logging in."
            )

        # Check if phone_number already exists (if provided)
        if user_create.phone_number:
            from sqlalchemy import select
            phone_query = select(User).where(User.phone_number == user_create.phone_number)
            result = await session.execute(phone_query)
            existing_user_by_phone = result.scalar_one_or_none()
            if existing_user_by_phone:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this phone number already exists. Please use a different phone number."
                )

        # Create user using the user manager (safe=True means it won't create superusers)
        user = await user_manager.create(user_create, safe=True)

        # Load user with role relationship
        result = await session.execute(
            select(User).where(User.id == user.id).options(selectinload(User.role))
        )
        user_with_role = result.scalar_one()

        # Send welcome email synchronously for debugging
        user_name = user_with_role.full_name or user_with_role.email.split('@')[0]
        print(f"[DEBUG] Register route: attempting to send email to {user_with_role.email}")
        await email_service.send_welcome_email(user_with_role.email, user_name)
        # background_tasks.add_task(email_service.send_welcome_email, user_with_role.email, user_name)

        # Return UserRead model
        return UserRead.model_validate(user_with_role)
    except HTTPException:
        # Re-raise HTTP exceptions (our custom validation errors)
        raise
    except ValueError as e:
        # Handle validation errors from user manager
        error_message = str(e)
        # Check if it's a duplicate email error
        if "email" in error_message.lower() or "already exists" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists. Please use a different email or try logging in."
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message
        )
    except Exception as e:
        # Handle database integrity errors (unique constraint violations)
        error_message = str(e).lower()
        if "duplicate entry" in error_message or "unique constraint" in error_message or "integrityerror" in error_message:
            if "email" in error_message:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this email address already exists. Please use a different email or try logging in."
                )
            elif "phone_number" in error_message or "phone" in error_message:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this phone number already exists. Please use a different phone number."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A user with this information already exists. Please check your email and phone number."
                )
        
        # Handle any other unexpected errors
        import traceback
        error_trace = traceback.format_exc()
        print(f"[ERROR] Registration error: {str(e)}")
        print(f"[ERROR] Traceback:\n{error_trace}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

router.include_router(
    fastapi_users.get_verify_router(UserRead),
)

# Custom forgot password endpoint that returns token in development mode
class ForgotPasswordRequest(BaseModel):
    """Forgot password request schema"""
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    """Forgot password response schema"""
    message: str
    token: Optional[str] = None  # Only included in development mode


@router.post("/forgot-password", response_model=ForgotPasswordResponse, status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(
    request_data: ForgotPasswordRequest,
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
    user_manager: UserManager = Depends(get_user_manager),
):
    """
    Request password reset token. 
    In development mode, the token is returned in the response.
    In production, the token is sent via email.
    """
    try:
        # Get user by email
        user = await user_db.get_by_email(request_data.email)
        
        # FastAPI Users always returns 202 to prevent email enumeration
        # So we return success even if user doesn't exist
        if user:
            # Clear previous token
            user_manager._last_reset_token = None
            user_manager._last_reset_user_id = None
            
            # Generate reset token using the user manager's forgot_password method
            # This will call on_after_forgot_password which stores the token
            await user_manager.forgot_password(user, request=None)
            
            # Check if token was generated (stored in callback)
            reset_token = user_manager._last_reset_token if user_manager._last_reset_user_id == user.id else None
            
            # Return the token in the response (for development - in production, configure email sending)
            if reset_token:
                return ForgotPasswordResponse(
                    message=f"Password reset token generated for {request_data.email}. Token included below for development.",
                    token=reset_token
                )
            else:
                return ForgotPasswordResponse(
                    message=f"If an account exists with {request_data.email}, you will receive a password reset token via email."
                )
        else:
            # User doesn't exist - still return 202 to prevent email enumeration
            return ForgotPasswordResponse(
                message=f"If an account exists with {request_data.email}, you will receive a password reset token via email."
            )
    except Exception as e:
        # Log error but still return 202 to prevent email enumeration
        import traceback
        print(f"[ERROR] Error in forgot_password: {str(e)}")
        print(f"[ERROR] Traceback:\n{traceback.format_exc()}")
        return ForgotPasswordResponse(
            message=f"If an account exists with {request_data.email}, you will receive a password reset token via email."
        )

router.include_router(
    fastapi_users.get_reset_password_router(),
)




@router.get(
    "/me",
    response_model=UserRead,
    summary="Get Current User",
    description="Get the currently authenticated user's information including role details",
    tags=["Authentication"],
    responses={
        200: {
            "description": "User information retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "email": "user@example.com",
                        "full_name": "John Doe",
                        "phone_number": "+1234567890",
                        "is_active": True,
                        "is_verified": True,
                        "is_superuser": False,
                        "role_id": 1,
                        "role": {
                            "id": 1,
                            "name": "normal",
                            "description": "Normal user with standard permissions"
                        }
                    }
                }
            }
        },
        401: {"description": "Not authenticated"},
    }
)
async def get_current_user(
    user: UserRead = Depends(get_current_user_with_role_read)
):
    """
    Get current authenticated user with role information.
    
    Returns the complete user profile including:
    - User ID, email, full name, phone number
    - Account status (active, verified, superuser)
    - Role information with permissions
    
    Requires authentication via JWT token.
    """
    # Use get_current_user_with_role_read dependency which returns UserRead
    # This avoids any SQLAlchemy lazy loading issues
    return user


@router.patch(
    "/me",
    response_model=UserRead,
    summary="Update Current User",
    description="Update the currently authenticated user's information",
    tags=["Authentication"],
    responses={
        200: {
            "description": "User information updated successfully",
        },
        401: {"description": "Not authenticated"},
        400: {"description": "Bad Request - Invalid data"},
    }
)
async def update_current_user(
    user_update: UserUpdate,
    user: User = Depends(current_active_user),
    user_manager: UserManager = Depends(get_user_manager),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Update current authenticated user.
    Validates that phone_number is unique if being updated.
    """
    try:
        # Check if phone_number is being updated and if it's already taken by another user
        if user_update.phone_number and user_update.phone_number != user.phone_number:
            from sqlalchemy import select
            phone_query = select(User).where(
                User.phone_number == user_update.phone_number,
                User.id != user.id  # Exclude current user
            )
            result = await session.execute(phone_query)
            existing_user_by_phone = result.scalar_one_or_none()
            if existing_user_by_phone:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this phone number already exists. Please use a different phone number."
                )
        
        # Update user using user manager
        updated_user = await user_manager.update(user_update, user, safe=True)
        
        # Load role relationship for the response
        # We need to reload it because user_manager.update might return a user without the relationship loaded
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        
        result = await session.execute(
            select(User).where(User.id == updated_user.id).options(selectinload(User.role))
        )
        user_with_role = result.scalar_one()
        
        return UserRead.model_validate(user_with_role)
        
    except HTTPException:
        # Re-raise HTTP exceptions (our custom validation errors)
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Handle database integrity errors (unique constraint violations)
        error_message = str(e).lower()
        if "duplicate entry" in error_message or "unique constraint" in error_message or "integrityerror" in error_message:
            if "phone_number" in error_message or "phone" in error_message:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this phone number already exists. Please use a different phone number."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A user with this information already exists. Please check your phone number."
                )
        
        import traceback
        print(f"[ERROR] Update user error: {str(e)}")
        print(f"[ERROR] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )


@router.patch(
    "/me/profile-picture",
    response_model=UserRead,
    summary="Upload Profile Picture",
    description="Upload or update the current user's profile picture",
    tags=["Authentication"],
    responses={
        200: {
            "description": "Profile picture uploaded successfully",
        },
        401: {"description": "Not authenticated"},
        400: {"description": "Bad Request - Invalid file"},
    }
)
async def upload_profile_picture(
    file: UploadFile = File(...),
    user: User = Depends(current_active_user),
    user_manager: UserManager = Depends(get_user_manager),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Upload or update profile picture for the current authenticated user.
    Stores the image in Backend/profile-pick/ folder in S3.
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Validate file size (max 5MB)
        file_content = await file.read()
        file_size = len(file_content)
        if file_size > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image size must be less than 5MB"
            )
        
        # Reset file pointer for upload
        await file.seek(0)
        
        # Upload to S3 in Backend/profile-pick/ folder
        from automex_backend.services.s3 import s3_service
        
        # Delete old profile picture from S3/local storage if exists
        if user.profile_picture_url:
            try:
                await s3_service.delete_file(user.profile_picture_url)
            except Exception as delete_error:
                # Log but don't fail if deletion fails
                print(f"[WARNING] Failed to delete old profile picture: {str(delete_error)}")
        
        # Upload new profile picture (will fallback to local storage if S3 fails)
        try:
            profile_picture_url = await s3_service.upload_file(file, folder="Backend/profile-pick/")
        except HTTPException as upload_error:
            # Re-raise HTTP exceptions with better error messages
            error_detail = upload_error.detail
            if "AWS" in error_detail or "S3" in error_detail or "credentials" in error_detail.lower():
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="File upload service is not properly configured. Please contact administrator or configure AWS S3 credentials in the .env file."
                )
            raise
        
        # Update user profile picture URL
        user_update = UserUpdate(profile_picture_url=profile_picture_url)
        updated_user = await user_manager.update(user_update, user, safe=True)
        
        # Load role relationship for the response
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        
        result = await session.execute(
            select(User).where(User.id == updated_user.id).options(selectinload(User.role))
        )
        user_with_role = result.scalar_one()
        
        print(f"Profile picture uploaded successfully for user {user.id}: {profile_picture_url}")
        return UserRead.model_validate(user_with_role)
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"[ERROR] Profile picture upload error: {str(e)}")
        print(f"[ERROR] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload profile picture: {str(e)}"
        )


@router.get(
    "/user-info",
    response_model=UserRead,
    summary="Get User Information",
    description="Get detailed information about the currently authenticated user",
    tags=["Authentication"],
    responses={
        200: {
            "description": "User information retrieved successfully",
        },
        401: {"description": "Not authenticated - Please provide a valid JWT token"},
    }
)
async def get_user_info(
    user: UserRead = Depends(get_current_user_with_role_read)
):
    """
    Get detailed user information.
    
    This endpoint returns comprehensive information about the authenticated user:
    - Personal details (email, name, phone)
    - Account status and permissions
    - Role and permissions information
    
    **Authentication Required**: This endpoint requires a valid JWT token in the Authorization header.
    
    **Example Request**:
    ```
    GET /api/v1/auth/user-info
    Authorization: Bearer <your-jwt-token>
    ```
    """
    return user


# Custom login schemas
class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Login response schema with user details, token, and role"""
    access_token: str
    token_type: str = "bearer"
    user: UserRead
    role: RoleRead


@router.get(
    "/users",
    response_model=List[UserRead],
    summary="Get All Users (Admin/Super Admin Only)",
    description="Get a list of all users in the system. Only accessible to admins and super admins.",
    tags=["Authentication", "Admin"],
    responses={
        200: {"description": "List of all users retrieved successfully"},
        401: {"description": "Not authenticated"},
        403: {"description": "Not authorized - Admin or Super Admin role required"},
    }
)
async def get_all_users(
    user: User = Depends(get_current_user_with_role),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Get all users in the system.
    
    This endpoint is restricted to admins and super admins only.
    Returns a list of all users with their role information.
    """
    # Check if user is admin or super admin
    if not user.is_superuser and (not user.role or user.role.name not in ['admin', 'super']):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin or Super Admin role required."
        )
    
    try:
        # Query all users with their roles
        result = await session.execute(
            select(User).options(selectinload(User.role)).order_by(User.id)
        )
        users = result.scalars().unique().all()
        
        # Convert to UserRead models
        users_read = [UserRead.model_validate(u) for u in users]
        
        return users_read
    except Exception as e:
        print(f"[ERROR] Error fetching all users: {str(e)}")
        print(f"[ERROR] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve users: {str(e)}"
        )


@router.get(
    "/users/{user_id}",
    response_model=UserRead,
    summary="Get User By ID (Admin/Super Admin Only)",
    description="Get details of a specific user by their ID. Only accessible to admins and super admins.",
    tags=["Authentication", "Admin"],
    responses={
        200: {"description": "User details retrieved successfully"},
        401: {"description": "Not authenticated"},
        403: {"description": "Not authorized - Admin or Super Admin role required"},
        404: {"description": "User not found"},
    }
)
async def get_user_by_id(
    user_id: int,
    user: User = Depends(get_current_user_with_role),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Get user details by ID.
    
    This endpoint is restricted to admins and super admins only.
    """
    # Check if user is admin or super admin
    if not user.is_superuser and (not user.role or user.role.name not in ['admin', 'super']):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin or Super Admin role required."
        )
    
    try:
        # Query user by ID with role
        result = await session.execute(
            select(User).where(User.id == user_id).options(selectinload(User.role))
        )
        target_user = result.scalar_one_or_none()
        
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        return UserRead.model_validate(target_user)
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error fetching user {user_id}: {str(e)}")
        print(f"[ERROR] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user: {str(e)}"
        )


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    login_data: LoginRequest,
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
    user_manager: UserManager = Depends(get_user_manager),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Custom login endpoint that accepts email and password as JSON.
    Returns JWT token along with user details and role.
    """
    try:
        # Get user by email
        user = await user_db.get_by_email(login_data.email)
        
        # Validate user exists
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive. Please contact support."
            )
        
        # Verify password using UserManager's password_helper
        # BaseUserManager has a password_helper property that uses passlib
        password_helper = user_manager.password_helper
        
        # Verify the password
        is_valid, updated_password_hash = password_helper.verify_and_update(
            login_data.password,
            user.hashed_password
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Update password hash if needed (in case password hashing algorithm was upgraded)
        if updated_password_hash:
            user.hashed_password = updated_password_hash
            await session.commit()
        
        # Load user with role relationship
        result = await session.execute(
            select(User).where(User.id == user.id).options(selectinload(User.role))
        )
        user_with_role = result.scalar_one()
        
        # Ensure role exists
        if not user_with_role.role:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User role not found. Please contact support."
            )
        
        # Generate JWT token using the authentication backend strategy
        jwt_strategy = get_jwt_strategy()
        access_token = await jwt_strategy.write_token(user)
        
        # Return response with token, user details, and role
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserRead.model_validate(user_with_role),
            role=RoleRead.model_validate(user_with_role.role)
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors)
        raise
    except Exception as e:
        # Handle any unexpected errors with full traceback
        print(f"[ERROR] Login error: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during login: {str(e)}"
        )

