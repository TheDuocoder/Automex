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
    
    # Check if latitude column exists
    cursor.execute("SHOW COLUMNS FROM pickup_request LIKE 'latitude'")
    if not cursor.fetchone():
        cursor.execute("ALTER TABLE pickup_request ADD COLUMN latitude FLOAT")
        print("✓ Added latitude column")
    else:
        print("✓ latitude column already exists")
    
    # Check if longitude column exists
    cursor.execute("SHOW COLUMNS FROM pickup_request LIKE 'longitude'")
    if not cursor.fetchone():
        cursor.execute("ALTER TABLE pickup_request ADD COLUMN longitude FLOAT")
        print("✓ Added longitude column")
    else:
        print("✓ longitude column already exists")
    
    conn.commit()
    print("\n✓ Migration completed successfully!")
    
    # Verify columns were added
    cursor.execute("DESCRIBE pickup_request")
    columns = [row[0] for row in cursor.fetchall()]
    print(f"\nCurrent columns in pickup_request table:")
    for col in columns:
        print(f"  - {col}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"✗ Error: {e}")
