"""
Migration script to add last_working_day column to employee table
"""
import asyncio
from sqlalchemy import text
from automex_backend.database import engine

async def add_last_working_day_column():
    """Add last_working_day column to employee table"""
    async with engine.begin() as conn:
        # Check if column already exists
        check_query = text("""
            SELECT COUNT(*) 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'employee' 
            AND COLUMN_NAME = 'last_working_day'
        """)
        
        result = await conn.execute(check_query)
        exists = result.scalar() > 0
        
        if not exists:
            # Add the column
            add_column_query = text("""
                ALTER TABLE employee 
                ADD COLUMN last_working_day DATETIME NULL AFTER hire_date
            """)
            await conn.execute(add_column_query)
            print("✓ Successfully added last_working_day column to employee table")
        else:
            print("✓ last_working_day column already exists in employee table")

if __name__ == "__main__":
    print("Adding last_working_day column to employee table...")
    asyncio.run(add_last_working_day_column())
    print("Migration completed!")

