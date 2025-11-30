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
    
    # 1. Add address column
    cursor.execute("SHOW COLUMNS FROM pickup_request LIKE 'address'")
    if not cursor.fetchone():
        # Adding as nullable first or with default to avoid issues with existing data
        # Using TEXT or VARCHAR(500)
        cursor.execute("ALTER TABLE pickup_request ADD COLUMN address VARCHAR(500) NOT NULL DEFAULT 'Not Provided'")
        print("✓ Added address column")
    else:
        print("✓ address column already exists")
    
    # 2. Make location column nullable
    # Check if it is already nullable?
    cursor.execute("SHOW COLUMNS FROM pickup_request LIKE 'location'")
    col_info = cursor.fetchone()
    # col_info: (Field, Type, Null, Key, Default, Extra)
    # Null is index 2
    if col_info and col_info[2] == 'NO':
         cursor.execute("ALTER TABLE pickup_request MODIFY COLUMN location VARCHAR(500) NULL")
         print("✓ Made location column nullable")
    else:
         print("✓ location column is already nullable or not found")
    
    conn.commit()
    print("\n✓ Migration completed successfully!")
    
    # Verify columns
    cursor.execute("DESCRIBE pickup_request")
    columns = cursor.fetchall()
    print(f"\nCurrent columns in pickup_request table:")
    for col in columns:
        print(f"  - {col[0]} ({col[1]}, Null: {col[2]})")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"✗ Error: {e}")
