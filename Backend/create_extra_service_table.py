"""
Migration script to create extra_service table
"""
import sys
import os
import asyncio

# Add the parent directory to the path so we can import from automex_backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from automex_backend.database import engine
from sqlalchemy import text

async def create_extra_service_table():
    """Create extra_service table"""
    async with engine.begin() as conn:
        try:
            # Check if table already exists
            result = await conn.execute(text("""
                SELECT COUNT(*) as count
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'extra_service'
            """))
            count = result.fetchone()[0]
            
            if count > 0:
                print("Table 'extra_service' already exists")
                return
            
            # Create the table
            await conn.execute(text("""
                CREATE TABLE extra_service (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    service_name VARCHAR(255) NOT NULL,
                    vehicle_name VARCHAR(255) NULL,
                    assigned_employee_id INT NULL,
                    price FLOAT NOT NULL,
                    owner_details TEXT NULL,
                    service_description TEXT NULL,
                    created_by_user_id INT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (assigned_employee_id) REFERENCES employee(id) ON DELETE SET NULL,
                    FOREIGN KEY (created_by_user_id) REFERENCES user(id),
                    INDEX idx_created_at (created_at),
                    INDEX idx_assigned_employee_id (assigned_employee_id)
                )
            """))
            print("Successfully created 'extra_service' table")
        except Exception as e:
            print(f"Error creating table: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(create_extra_service_table())

