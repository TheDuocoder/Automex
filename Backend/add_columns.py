import asyncio
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+aiomysql://root:root@localhost:3306/automex")

async def add_columns():
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        try:
            # Check if latitude column exists
            result = await conn.execute(text("SHOW COLUMNS FROM pickup_request LIKE 'latitude'"))
            if not result.fetchone():
                await conn.execute(text("ALTER TABLE pickup_request ADD COLUMN latitude FLOAT"))
                print("✓ Added latitude column")
            else:
                print("✓ latitude column already exists")
            
            # Check if longitude column exists  
            result = await conn.execute(text("SHOW COLUMNS FROM pickup_request LIKE 'longitude'"))
            if not result.fetchone():
                await conn.execute(text("ALTER TABLE pickup_request ADD COLUMN longitude FLOAT"))
                print("✓ Added longitude column")
            else:
                print("✓ longitude column already exists")
                
            print("\n✓ Migration completed successfully!")
        except Exception as e:
            print(f"✗ Error: {e}")
        finally:
            await engine.dispose()

if __name__ == "__main__":
    asyncio.run(add_columns())
