"""
Authentication routes using FastAPI Users
"""
from typing import Optional
from fastapi import APIRouter, Depends, Request, HTTPException, status
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

router = APIRouter()


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    """User manager for handling user operations"""
    reset_password_token_secret = settings.SECRET_KEY
    verification_token_secret = settings.SECRET_KEY

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"[INFO] User {user.id} has registered: {user.email} with role_id: {user.role_id}")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"[INFO] User {user.id} has forgot their password. Reset token: {token}")

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
    user_manager: UserManager = Depends(get_user_manager),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Register a new user (public endpoint - no authentication required)
    
    This endpoint allows users to create a new account without being authenticated.
    """
    try:
        # Create user using the user manager (safe=True means it won't create superusers)
        user = await user_manager.create(user_create, safe=True)
        
        # Load user with role relationship
        result = await session.execute(
            select(User).where(User.id == user.id).options(selectinload(User.role))
        )
        user_with_role = result.scalar_one()
        
        # Return UserRead model
        return UserRead.model_validate(user_with_role)
    except ValueError as e:
        # Handle validation errors (e.g., user already exists)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
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

router.include_router(
    fastapi_users.get_reset_password_router(),
)

# Don't use FastAPI Users' users router - it has the problematic /me endpoint
# Instead, create our own users router with properly handled endpoints
users_router = APIRouter()

# Custom /me endpoint that returns UserRead directly
# This bypasses FastAPI Users' model_validate which causes the greenlet error
@users_router.get("/me", response_model=UserRead, name="users:me")
async def get_current_user_custom(
    user: UserRead = Depends(get_current_user_with_role_read)
):
    """Get current authenticated user with role information (custom implementation)
    
    This endpoint returns the user as a UserRead Pydantic model that's already
    constructed from plain Python types, avoiding any SQLAlchemy lazy loading issues.
    """
    # The dependency already returns UserRead, so just return it directly
    return user

# Add other user management endpoints if needed
# For now, we only override the /me endpoint

router.include_router(users_router, prefix="/users")


@router.get("/me", response_model=UserRead)
async def get_current_user(
    user: UserRead = Depends(get_current_user_with_role_read)
):
    """Get current authenticated user with role information"""
    # Use get_current_user_with_role_read dependency which returns UserRead
    # This avoids any SQLAlchemy lazy loading issues
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
        # Handle any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during login: {str(e)}"
        )

