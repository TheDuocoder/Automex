"""
Migration script to add pickup_time column to pickup_request table
"""
import asyncio
from sqlalchemy import text
from automex_backend.database import engine


async def add_pickup_time_column():
    """Add pickup_time column to pickup_request table"""
    async with engine.begin() as conn:
        # Check if column already exists
        check_query = text("""
            SELECT COUNT(*) as count
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'pickup_request'
            AND COLUMN_NAME = 'pickup_time'
        """)
        
        result = await conn.execute(check_query)
        row = result.fetchone()
        
        if row and row[0] == 0:
            # Column doesn't exist, add it
            alter_query = text("""
                ALTER TABLE pickup_request
                ADD COLUMN pickup_time DATETIME NULL
            """)
            await conn.execute(alter_query)
            print("✓ Added pickup_time column to pickup_request table")
        else:
            print("✓ pickup_time column already exists")


if __name__ == "__main__":
    asyncio.run(add_pickup_time_column())

