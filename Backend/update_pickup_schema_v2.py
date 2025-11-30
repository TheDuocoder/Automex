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

async def update_schema():
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        try:
            # 1. Add address column
            result = await conn.execute(text("SHOW COLUMNS FROM pickup_request LIKE 'address'"))
            if not result.fetchone():
                # Adding as nullable first or with default to avoid issues with existing data
                await conn.execute(text("ALTER TABLE pickup_request ADD COLUMN address VARCHAR(500) NOT NULL DEFAULT 'Not Provided'"))
                print("✓ Added address column")
            else:
                print("✓ address column already exists")
            
            # 2. Make location column nullable
            # MySQL syntax to modify column
            await conn.execute(text("ALTER TABLE pickup_request MODIFY COLUMN location VARCHAR(500) NULL"))
            print("✓ Made location column nullable")
                
            print("\n✓ Schema update completed successfully!")
        except Exception as e:
            print(f"✗ Error: {e}")
        finally:
            await engine.dispose()

if __name__ == "__main__":
    asyncio.run(update_schema())
