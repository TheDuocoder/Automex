"""
Migration script to create employee table
"""
import asyncio
from sqlalchemy import text
from automex_backend.database import engine

async def create_employee_table():
    """Create employee table if it doesn't exist"""
    async with engine.begin() as conn:
        # Check if table already exists
        check_query = text("""
            SELECT COUNT(*) 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'employee'
        """)
        
        result = await conn.execute(check_query)
        exists = result.scalar() > 0
        
        if not exists:
            # Create the employee table
            create_table_query = text("""
                CREATE TABLE employee (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    full_name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    phone_number VARCHAR(20) NULL UNIQUE,
                    position VARCHAR(100) NULL,
                    department VARCHAR(100) NULL,
                    address TEXT NULL,
                    salary FLOAT NULL,
                    hire_date DATETIME NULL,
                    last_working_day DATETIME NULL,
                    employee_id VARCHAR(50) NULL UNIQUE,
                    notes TEXT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    created_by_user_id INT NOT NULL,
                    FOREIGN KEY (created_by_user_id) REFERENCES user(id) ON DELETE CASCADE,
                    INDEX idx_email (email),
                    INDEX idx_phone_number (phone_number),
                    INDEX idx_employee_id (employee_id),
                    INDEX idx_created_by_user_id (created_by_user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            await conn.execute(create_table_query)
            print("✓ Successfully created employee table")
        else:
            print("✓ Employee table already exists")

if __name__ == "__main__":
    print("Creating employee table...")
    asyncio.run(create_employee_table())
    print("Migration completed!")

