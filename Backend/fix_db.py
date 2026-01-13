import asyncio
import logging
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.getcwd(), "src"))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from automex_backend.database import init_db

async def main():
    print("Starting manual database update...")
    try:
        await init_db()
        print("Database update completed successfully.")
    except Exception as e:
        print(f"Error updating database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
