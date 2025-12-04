"""
Migration script to add profile_picture_url column to user table
Run this script to add the profile_picture_url field to existing databases
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
    
    # Check if profile_picture_url column exists
    cursor.execute("SHOW COLUMNS FROM `user` LIKE 'profile_picture_url'")
    if not cursor.fetchone():
        cursor.execute("""
            ALTER TABLE `user`
            ADD COLUMN `profile_picture_url` VARCHAR(500) NULL DEFAULT NULL
            AFTER `phone_number`
        """)
        print("[SUCCESS] Added profile_picture_url column")
    else:
        print("[INFO] profile_picture_url column already exists")
    
    conn.commit()
    print("\n[SUCCESS] Migration completed successfully!")
    
    # Verify column was added
    cursor.execute("DESCRIBE `user`")
    columns = [row[0] for row in cursor.fetchall()]
    print(f"\nCurrent columns in user table:")
    for col in columns:
        print(f"  - {col}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"[ERROR] {e}")
    raise

