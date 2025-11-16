"""
Database configuration and session management
"""
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from automex_backend.config import settings


class Base(DeclarativeBase):
    """Base class for all database models"""
    pass


# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True
)

# Create async session maker
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def init_db():
    """Initialize database and create tables"""
    async with engine.begin() as conn:
        # Import all models here to ensure they're registered
        from automex_backend.models import role, user, service, booking
        
        # In DEBUG mode, drop and recreate tables to ensure schema is up to date
        # This ensures new columns are always added
        # WARNING: This will delete all data in DEBUG mode!
        if settings.DEBUG:
            try:
                # Check if bookings table exists and has new columns
                from sqlalchemy import inspect, text
                
                # Use sync engine for inspection
                sync_engine = conn.sync_engine
                inspector = inspect(sync_engine)
                
                if inspector.has_table("bookings"):
                    # Check if new columns exist
                    columns = [col['name'] for col in inspector.get_columns("bookings")]
                    required_columns = ['car_brand', 'car_model', 'fuel_type', 'service_name']
                    missing_columns = [col for col in required_columns if col not in columns]
                    
                    if missing_columns:
                        print(f"[INFO] Missing columns detected: {missing_columns}")
                        print("[INFO] Dropping and recreating tables to update schema...")
                        await conn.run_sync(Base.metadata.drop_all)
                        print("[INFO] Tables dropped successfully")
                    else:
                        print("[INFO] All required columns exist, skipping table recreation")
                else:
                    print("[INFO] Bookings table doesn't exist, will be created")
            except Exception as e:
                print(f"[WARNING] Could not check table schema: {e}")
                print("[INFO] Dropping and recreating tables to ensure schema is correct...")
                await conn.run_sync(Base.metadata.drop_all)
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
        print("[INFO] All tables created successfully")
    
    # Seed default roles
    await seed_roles()


async def seed_roles():
    """Seed default roles into the database"""
    from automex_backend.models.role import Role
    from sqlalchemy import select
    
    async with async_session_maker() as session:
        # Check if roles already exist
        result = await session.execute(select(Role))
        existing_roles = result.scalars().all()
        
        if not existing_roles:
            # Create default roles
            roles = [
                Role(id=1, name="normal", description="Normal user with standard permissions"),
                Role(id=2, name="admin", description="Administrator with elevated permissions"),
                Role(id=3, name="super", description="Super admin with full system access"),
            ]
            
            session.add_all(roles)
            await session.commit()
            print("[INFO] Default roles seeded successfully")
        else:
            print("[INFO] Roles already exist, skipping seed")


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get async database session
    """
    async with async_session_maker() as session:
        yield session

