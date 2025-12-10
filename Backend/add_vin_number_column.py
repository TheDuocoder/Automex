"""
Migration script to add vin_number column to car table
"""
import asyncio
from sqlalchemy import text
from automex_backend.database import engine

async def add_vin_number_column():
    """Add vin_number column to car table"""
    async with engine.begin() as conn:
        # Check if column already exists
        check_query = text("""
            SELECT COUNT(*) 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'car' 
            AND COLUMN_NAME = 'vin_number'
        """)
        
        result = await conn.execute(check_query)
        exists = result.scalar() > 0
        
        if not exists:
            # Add the column
            add_column_query = text("""
                ALTER TABLE car 
                ADD COLUMN vin_number VARCHAR(17) NULL AFTER registration_number
            """)
            await conn.execute(add_column_query)
            print("✓ Successfully added vin_number column to car table")
        else:
            print("✓ vin_number column already exists in car table")

if __name__ == "__main__":
    print("Adding vin_number column to car table...")
    asyncio.run(add_vin_number_column())
    print("Migration completed!")
