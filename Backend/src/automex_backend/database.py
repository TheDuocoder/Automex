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
        from automex_backend.models import (
            role, user, service, booking, cost, car, service_history, 
            pickup_request, daily_work_log, employee, booking_employee_assignment, extra_service
        )
        
        from sqlalchemy import text
        
        # Always check and update schema automatically
        try:
            print("[INFO] Checking database schema and updating automatically...")
            
            # Get all tables from metadata
            metadata = Base.metadata
            
            # Helper function to convert SQLAlchemy type to MySQL type
            def get_mysql_type(column_type):
                type_str = str(column_type)
                # Map common SQLAlchemy types to MySQL types
                if 'INTEGER' in type_str or 'Integer' in type_str:
                    return 'INT'
                elif 'VARCHAR' in type_str:
                    # Extract length if present
                    import re
                    match = re.search(r'VARCHAR\((\d+)\)', type_str)
                    if match:
                        return f"VARCHAR({match.group(1)})"
                    return 'VARCHAR(255)'
                elif 'TEXT' in type_str:
                    return 'TEXT'
                elif 'FLOAT' in type_str or 'Float' in type_str:
                    return 'FLOAT'
                elif 'DATETIME' in type_str or 'DateTime' in type_str:
                    if 'timezone=True' in type_str:
                        return 'DATETIME'
                    return 'DATETIME'
                elif 'BOOLEAN' in type_str or 'Boolean' in type_str:
                    return 'BOOLEAN'
                else:
                    return type_str
            
            # Check each table in metadata
            for table_name, table in metadata.tables.items():
                # Check if table exists
                table_check = text("""
                    SELECT COUNT(*) as count 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name = :table_name
                """)
                result = await conn.execute(table_check, {"table_name": table_name})
                table_exists = result.scalar() > 0
                
                if not table_exists:
                    print(f"[INFO] Table '{table_name}' does not exist, will be created by SQLAlchemy...")
                else:
                    # Table exists, check for missing columns
                    print(f"[INFO] Table '{table_name}' exists, checking for missing columns...")
                    
                    # Get existing columns
                    columns_check = text("""
                        SELECT column_name
                        FROM information_schema.columns 
                        WHERE table_schema = DATABASE() 
                        AND table_name = :table_name
                    """)
                    result = await conn.execute(columns_check, {"table_name": table_name})
                    existing_columns = {row[0] for row in result.fetchall()}
                    
                    # Check each column in the model
                    for column in table.columns:
                        if column.name not in existing_columns:
                            print(f"[INFO] Column '{column.name}' missing in '{table_name}', adding...")
                            
                            try:
                                # Build ALTER TABLE statement
                                mysql_type = get_mysql_type(column.type)
                                nullable = "NULL" if column.nullable else "NOT NULL"
                                default_clause = ""
                                
                                if column.server_default is not None:
                                    default_value = str(column.server_default.arg)
                                    if "CURRENT_TIMESTAMP" in default_value or "now()" in default_value.lower():
                                        default_clause = "DEFAULT CURRENT_TIMESTAMP"
                                    elif default_value:
                                        # Remove quotes if present
                                        default_value = default_value.strip("'\"")
                                        default_clause = f"DEFAULT '{default_value}'"
                                
                                alter_sql = f"ALTER TABLE `{table_name}` ADD COLUMN `{column.name}` {mysql_type} {nullable}"
                                if default_clause:
                                    alter_sql += f" {default_clause}"
                                
                                await conn.execute(text(alter_sql))
                                print(f"[INFO] ✓ Column '{column.name}' added to '{table_name}' successfully")
                            except Exception as col_error:
                                print(f"[WARNING] Failed to add column '{column.name}' to '{table_name}': {col_error}")
                                # Continue with other columns
            
            print("[INFO] Database schema check completed")
        
        except Exception as e:
            print(f"[WARNING] Error during automatic schema update: {e}")
            import traceback
            print(f"[WARNING] Traceback: {traceback.format_exc()}")
            # Continue with normal table creation
        
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
                        print("[INFO] All required columns exist in bookings, skipping table recreation")
                else:
                    print("[INFO] Bookings table doesn't exist, will be created")

                # --- Pickup Request Schema Updates ---
                # Check pickup_request table
                pickup_table_check = text("""
                    SELECT COUNT(*) as count 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name = 'pickup_request'
                """)
                result = await conn.execute(pickup_table_check)
                pickup_exists = result.scalar() > 0

                if pickup_exists:
                    print("[INFO] Checking pickup_request schema...")
                    
                    # 1. Check/Add address column and ensure it's not NULL
                    address_check = text("""
                        SELECT COUNT(*) FROM information_schema.columns 
                        WHERE table_schema = DATABASE() 
                        AND table_name = 'pickup_request' 
                        AND column_name = 'address'
                    """)
                    if (await conn.execute(address_check)).scalar() == 0:
                        print("[INFO] Adding 'address' column to pickup_request...")
                        await conn.execute(text("ALTER TABLE pickup_request ADD COLUMN address VARCHAR(500) NOT NULL DEFAULT 'Not Provided'"))
                    else:
                        # Update any NULL address values to default
                        print("[INFO] Updating NULL address values in pickup_request...")
                        await conn.execute(text("UPDATE pickup_request SET address = 'Not Provided' WHERE address IS NULL OR address = ''"))
                    
                    # 2. Check/Add latitude column
                    lat_check = text("""
                        SELECT COUNT(*) FROM information_schema.columns 
                        WHERE table_schema = DATABASE() 
                        AND table_name = 'pickup_request' 
                        AND column_name = 'latitude'
                    """)
                    if (await conn.execute(lat_check)).scalar() == 0:
                        print("[INFO] Adding 'latitude' column to pickup_request...")
                        await conn.execute(text("ALTER TABLE pickup_request ADD COLUMN latitude FLOAT NULL"))

                    # 3. Check/Add longitude column
                    lng_check = text("""
                        SELECT COUNT(*) FROM information_schema.columns 
                        WHERE table_schema = DATABASE() 
                        AND table_name = 'pickup_request' 
                        AND column_name = 'longitude'
                    """)
                    if (await conn.execute(lng_check)).scalar() == 0:
                        print("[INFO] Adding 'longitude' column to pickup_request...")
                        await conn.execute(text("ALTER TABLE pickup_request ADD COLUMN longitude FLOAT NULL"))

                    # 4. Make location nullable
                    loc_check = text("""
                        SELECT IS_NULLABLE FROM information_schema.columns 
                        WHERE table_schema = DATABASE() 
                        AND table_name = 'pickup_request' 
                        AND column_name = 'location'
                    """)
                    loc_result = await conn.execute(loc_check)
                    loc_nullable = loc_result.scalar()
                    
                    if loc_nullable == 'NO':
                        print("[INFO] Making 'location' column nullable in pickup_request...")
                        await conn.execute(text("ALTER TABLE pickup_request MODIFY COLUMN location VARCHAR(500) NULL"))
                    
                    print("[INFO] pickup_request schema check completed")

            except Exception as e:
                print(f"[WARNING] Could not check table schema: {e}")
                # Only drop if it's a critical failure in debug mode, but prefer not to
                # print("[INFO] Dropping and recreating tables to ensure schema is correct...")
                # await conn.run_sync(Base.metadata.drop_all)
        
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

