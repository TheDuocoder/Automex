"""
Migration script to add created_at column to pickup_request table
"""
import asyncio
from sqlalchemy import text
from automex_backend.database import engine


async def add_created_at_column():
    """Add created_at column to pickup_request table"""
    async with engine.begin() as conn:
        # Check if column already exists
        check_query = text("""
            SELECT COUNT(*) as count
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'pickup_request'
            AND COLUMN_NAME = 'created_at'
        """)
        
        result = await conn.execute(check_query)
        row = result.fetchone()
        
        if row and row[0] == 0:
            # Column doesn't exist, add it
            alter_query = text("""
                ALTER TABLE pickup_request
                ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            """)
            await conn.execute(alter_query)
            print("✓ Added created_at column to pickup_request table")
            
            # Update existing rows to have created_at = scheduled_date (or current timestamp)
            update_query = text("""
                UPDATE pickup_request
                SET created_at = scheduled_date
                WHERE created_at IS NULL
            """)
            await conn.execute(update_query)
            print("✓ Updated existing rows with created_at values")
        else:
            print("✓ created_at column already exists")


if __name__ == "__main__":
    asyncio.run(add_created_at_column())

