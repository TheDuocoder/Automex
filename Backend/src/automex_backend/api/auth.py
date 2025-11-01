"""
Authentication routes using FastAPI Users
"""
from fastapi import APIRouter, Depends
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from automex_backend.config import settings
from automex_backend.database import get_async_session
from automex_backend.models.user import User
from automex_backend.schemas.user import UserRead, UserCreate, UserUpdate

router = APIRouter()


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


# FastAPI Users instance
fastapi_users = FastAPIUsers[User, int](
    get_user_db,
    [auth_backend],
)

# Get current active user dependency
current_active_user = fastapi_users.current_user(active=True)


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
async def get_current_user(user: User = Depends(current_active_user)):
    """Get current authenticated user"""
    return user

