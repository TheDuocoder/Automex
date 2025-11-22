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


# Create async engine with MySQL optimizations for faster async communication
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,   # Recycle connections after 1 hour
    pool_size=10,        # Connection pool size
    max_overflow=20,     # Maximum overflow connections
    pool_reset_on_return='commit',  # Reset connections on return
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
        from automex_backend.models import role, user, service, booking, cost
        
        # In DEBUG mode, drop and recreate tables to ensure schema is up to date
        # This ensures new columns are always added
        # WARNING: This will delete all data in DEBUG mode!
        if settings.DEBUG:
            try:
                # Check if bookings table exists and has new columns using MySQL async queries
                from sqlalchemy import text
                
                # Check if table exists using MySQL information_schema
                table_check = text("""
                    SELECT COUNT(*) as count 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name = 'bookings'
                """)
                result = await conn.execute(table_check)
                table_exists = result.scalar() > 0
                
                if table_exists:
                    # Check if status column is ENUM type (needs to be VARCHAR)
                    status_check = text("""
                        SELECT DATA_TYPE, COLUMN_TYPE
                        FROM information_schema.columns 
                        WHERE table_schema = DATABASE() 
                        AND table_name = 'bookings' 
                        AND column_name = 'status'
                    """)
                    result = await conn.execute(status_check)
                    status_info = result.fetchone()
                    
                    # Check for required columns using MySQL information_schema
                    columns_check = text("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_schema = DATABASE() 
                        AND table_name = 'bookings' 
                        AND column_name IN ('car_brand', 'car_model', 'fuel_type', 'service_name')
                    """)
                    result = await conn.execute(columns_check)
                    existing_columns = [row[0] for row in result.fetchall()]
                    required_columns = ['car_brand', 'car_model', 'fuel_type', 'service_name']
                    missing_columns = [col for col in required_columns if col not in existing_columns]
                    
                    # If status is ENUM type, convert it to VARCHAR
                    if status_info and status_info[0] == 'enum':
                        print(f"[INFO] Status column is ENUM type, converting to VARCHAR(50)...")
                        alter_status = text("ALTER TABLE bookings MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending'")
                        await conn.execute(alter_status)
                        print("[INFO] Status column converted to VARCHAR successfully")
                    
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
        
        # Create all tables using async MySQL
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

