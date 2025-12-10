"""
Migration script to add assigned_employee_id column to bookings table
"""
import sys
import os
import asyncio

# Add the parent directory to the path so we can import from automex_backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from automex_backend.database import engine
from sqlalchemy import text

async def add_assigned_employee_id_column():
    """Add assigned_employee_id column to bookings table"""
    async with engine.begin() as conn:
        try:
            # Check if column already exists
            result = await conn.execute(text("""
                SELECT COUNT(*) as count
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'bookings'
                AND COLUMN_NAME = 'assigned_employee_id'
            """))
            count = result.fetchone()[0]
            
            if count > 0:
                print("Column 'assigned_employee_id' already exists in 'bookings' table")
                return
            
            # Add the column
            await conn.execute(text("""
                ALTER TABLE bookings
                ADD COLUMN assigned_employee_id INT NULL,
                ADD FOREIGN KEY (assigned_employee_id) REFERENCES employee(id)
            """))
            print("Successfully added 'assigned_employee_id' column to 'bookings' table")
        except Exception as e:
            print(f"Error adding column: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(add_assigned_employee_id_column())

