"""
Migration script to create daily_work_logs table
Run this script to create the daily_work_logs table for date-wise work documentation
"""
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Parse DATABASE_URL
db_url = os.getenv("DATABASE_URL", "mysql+aiomysql://root:root@localhost:3306/automex")
# Extract connection details from URL
# Format: mysql+aiomysql://user:password@host:port/database
parts = db_url.replace("mysql+aiomysql://", "").split("@")
user_pass = parts[0].split(":")
host_db = parts[1].split("/")
host_port = host_db[0].split(":")

user = user_pass[0]
password = user_pass[1] if len(user_pass) > 1 else ""
host = host_port[0]
port = int(host_port[1]) if len(host_port) > 1 else 3306
database = host_db[1]

print(f"Connecting to database: {database} on {host}:{port}")

try:
    conn = pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database
    )
    cursor = conn.cursor()
    
    # Check if table exists
    cursor.execute("SHOW TABLES LIKE 'daily_work_logs'")
    if cursor.fetchone():
        print("[INFO] daily_work_logs table already exists")
    else:
        # Try JSON type first (MySQL 5.7+)
        try:
            cursor.execute("""
                CREATE TABLE `daily_work_logs` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `booking_id` INT NOT NULL,
                    `log_date` DATE NOT NULL,
                    `description` TEXT NULL,
                    `photos` JSON NULL,
                    `videos` JSON NULL,
                    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                    INDEX `ix_daily_work_logs_booking_id` (`booking_id`),
                    INDEX `ix_daily_work_logs_log_date` (`log_date`),
                    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            print("[SUCCESS] Created daily_work_logs table (JSON type)")
        except Exception as json_error:
            # Fallback to TEXT if JSON is not supported
            print(f"[WARNING] JSON type not supported, using TEXT: {json_error}")
            cursor.execute("""
                CREATE TABLE `daily_work_logs` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `booking_id` INT NOT NULL,
                    `log_date` DATE NOT NULL,
                    `description` TEXT NULL,
                    `photos` TEXT NULL,
                    `videos` TEXT NULL,
                    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                    INDEX `ix_daily_work_logs_booking_id` (`booking_id`),
                    INDEX `ix_daily_work_logs_log_date` (`log_date`),
                    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            print("[SUCCESS] Created daily_work_logs table (TEXT type)")
    
    conn.commit()
    print("\n[SUCCESS] Migration completed successfully!")
    
    # Verify table was created
    cursor.execute("DESCRIBE `daily_work_logs`")
    columns = cursor.fetchall()
    print(f"\nColumns in daily_work_logs table:")
    for col in columns:
        print(f"  - {col[0]} ({col[1]})")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"[ERROR] {e}")
    raise

