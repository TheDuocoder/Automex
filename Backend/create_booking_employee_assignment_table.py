"""
Migration script to create booking_employee_assignment table
"""
import sys
import os
import asyncio

# Add the parent directory to the path so we can import from automex_backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from automex_backend.database import engine
from sqlalchemy import text

async def create_booking_employee_assignment_table():
    """Create booking_employee_assignment table"""
    async with engine.begin() as conn:
        try:
            # Check if table already exists
            result = await conn.execute(text("""
                SELECT COUNT(*) as count
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'booking_employee_assignment'
            """))
            count = result.fetchone()[0]
            
            if count > 0:
                print("Table 'booking_employee_assignment' already exists")
                return
            
            # Create the table
            await conn.execute(text("""
                CREATE TABLE booking_employee_assignment (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    booking_id INT NOT NULL,
                    employee_id INT NULL,
                    assigned_by_user_id INT NOT NULL,
                    notes TEXT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
                    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE SET NULL,
                    FOREIGN KEY (assigned_by_user_id) REFERENCES user(id),
                    INDEX idx_booking_id (booking_id),
                    INDEX idx_employee_id (employee_id),
                    INDEX idx_assigned_by_user_id (assigned_by_user_id)
                )
            """))
            print("Successfully created 'booking_employee_assignment' table")
        except Exception as e:
            print(f"Error creating table: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(create_booking_employee_assignment_table())

