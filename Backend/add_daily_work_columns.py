"""
Migration script to add daily work columns to bookings table
Run this script to add the daily work fields to existing databases
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
    
    # Check if daily_work_description column exists
    cursor.execute("SHOW COLUMNS FROM `bookings` LIKE 'daily_work_description'")
    if not cursor.fetchone():
        cursor.execute("""
            ALTER TABLE `bookings`
            ADD COLUMN `daily_work_description` TEXT NULL DEFAULT NULL
            AFTER `technician_notes`
        """)
        print("[SUCCESS] Added daily_work_description column")
    else:
        print("[INFO] daily_work_description column already exists")
    
    # Check if daily_work_photos column exists
    cursor.execute("SHOW COLUMNS FROM `bookings` LIKE 'daily_work_photos'")
    if not cursor.fetchone():
        # Try JSON type first (MySQL 5.7+)
        try:
            cursor.execute("""
                ALTER TABLE `bookings`
                ADD COLUMN `daily_work_photos` JSON NULL DEFAULT NULL
                AFTER `daily_work_description`
            """)
            print("[SUCCESS] Added daily_work_photos column (JSON type)")
        except Exception as json_error:
            # Fallback to TEXT if JSON is not supported
            print(f"[WARNING] JSON type not supported, using TEXT: {json_error}")
            cursor.execute("""
                ALTER TABLE `bookings`
                ADD COLUMN `daily_work_photos` TEXT NULL DEFAULT NULL
                AFTER `daily_work_description`
            """)
            print("[SUCCESS] Added daily_work_photos column (TEXT type)")
    else:
        print("[INFO] daily_work_photos column already exists")
    
    # Check if daily_work_videos column exists
    cursor.execute("SHOW COLUMNS FROM `bookings` LIKE 'daily_work_videos'")
    if not cursor.fetchone():
        # Try JSON type first (MySQL 5.7+)
        try:
            cursor.execute("""
                ALTER TABLE `bookings`
                ADD COLUMN `daily_work_videos` JSON NULL DEFAULT NULL
                AFTER `daily_work_photos`
            """)
            print("[SUCCESS] Added daily_work_videos column (JSON type)")
        except Exception as json_error:
            # Fallback to TEXT if JSON is not supported
            print(f"[WARNING] JSON type not supported, using TEXT: {json_error}")
            cursor.execute("""
                ALTER TABLE `bookings`
                ADD COLUMN `daily_work_videos` TEXT NULL DEFAULT NULL
                AFTER `daily_work_photos`
            """)
            print("[SUCCESS] Added daily_work_videos column (TEXT type)")
    else:
        print("[INFO] daily_work_videos column already exists")
    
    conn.commit()
    print("\n[SUCCESS] Migration completed successfully!")
    
    # Verify columns were added
    cursor.execute("DESCRIBE `bookings`")
    columns = [row[0] for row in cursor.fetchall()]
    print(f"\nCurrent columns in bookings table:")
    for col in columns:
        print(f"  - {col}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"[ERROR] {e}")
    raise

