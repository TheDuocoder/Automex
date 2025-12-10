"""
Migration script to add drop_time column to pickup_request table
"""
import asyncio
from sqlalchemy import text
from automex_backend.database import engine


async def add_drop_time_column():
    """Add drop_time column to pickup_request table"""
    async with engine.begin() as conn:
        # Check if column already exists
        check_query = text("""
            SELECT COUNT(*) as count
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'pickup_request'
            AND COLUMN_NAME = 'drop_time'
        """)
        
        result = await conn.execute(check_query)
        row = result.fetchone()
        
        if row and row[0] == 0:
            # Column doesn't exist, add it
            alter_query = text("""
                ALTER TABLE pickup_request
                ADD COLUMN drop_time DATETIME NULL
            """)
            await conn.execute(alter_query)
            print("✓ Added drop_time column to pickup_request table")
        else:
            print("✓ drop_time column already exists")


if __name__ == "__main__":
    asyncio.run(add_drop_time_column())

