"""
Authentication routes using FastAPI Users
"""
from typing import Optional
from fastapi import APIRouter, Depends, Request
from fastapi_users import FastAPIUsers, BaseUserManager, IntegerIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.config import settings
from automex_backend.database import get_async_session
from automex_backend.models.user import User
from automex_backend.schemas.user import UserRead, UserCreate, UserUpdate

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
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


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


# Custom dependency to get user with role loaded
async def get_current_user_with_role(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
) -> User:
    """Get current user with role relationship loaded"""
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    
    result = await session.execute(
        select(User).where(User.id == user.id).options(selectinload(User.role))
    )
    return result.scalar_one()


# Include auth routes
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt"
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)

router.include_router(
    fastapi_users.get_verify_router(UserRead),
)

router.include_router(
    fastapi_users.get_reset_password_router(),
)

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users"
)


@router.get("/me", response_model=UserRead)
async def get_current_user(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Get current authenticated user with role information"""
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    
    # Reload user with role relationship
    result = await session.execute(
        select(User).where(User.id == user.id).options(selectinload(User.role))
    )
    user_with_role = result.scalar_one()
    return user_with_role

