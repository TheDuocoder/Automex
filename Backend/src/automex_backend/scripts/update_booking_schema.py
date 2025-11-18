"""
Script to update bookings table schema with new columns
Run this script to add new columns to the bookings table without losing data
"""
import asyncio
from sqlalchemy import text
from automex_backend.database import engine, async_session_maker


async def update_bookings_schema():
    """Add new columns to bookings table if they don't exist"""
    async with engine.begin() as conn:
        # Check and add new columns using MySQL async queries
        columns_to_add = [
            ("car_brand", "VARCHAR(100)"),
            ("car_model", "VARCHAR(100)"),
            ("fuel_type", "VARCHAR(50)"),
            ("service_name", "VARCHAR(255)"),
        ]
        
        for column_name, column_type in columns_to_add:
            try:
                # Check if column exists using MySQL information_schema (async)
                check_query = text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_schema = DATABASE() 
                    AND table_name = 'bookings' 
                    AND column_name = :column_name
                """)
                result = await conn.execute(check_query, {"column_name": column_name})
                exists = result.fetchone() is not None
                
                if not exists:
                    # Add column using MySQL ALTER TABLE (async)
                    alter_query = text(f"ALTER TABLE bookings ADD COLUMN {column_name} {column_type}")
                    await conn.execute(alter_query)
                    print(f"[SUCCESS] Added column: {column_name}")
                else:
                    print(f"[INFO] Column already exists: {column_name}")
            except Exception as e:
                print(f"[ERROR] Failed to add column {column_name}: {str(e)}")
        
        # Make existing columns nullable if needed
        nullable_updates = [
            ("vehicle_make", "VARCHAR(100)"),
            ("vehicle_model", "VARCHAR(100)"),
            ("vehicle_year", "INTEGER"),
            ("vehicle_registration", "VARCHAR(50)"),
            ("contact_name", "VARCHAR(255)"),
            ("contact_phone", "VARCHAR(20)"),
            ("pickup_address", "TEXT"),
            ("service_id", "INTEGER"),
        ]
        
        print("\n[INFO] Schema update completed!")
        print("[INFO] Note: Making columns nullable requires manual database migration in production")


if __name__ == "__main__":
    print("Updating bookings table schema...")
    asyncio.run(update_bookings_schema())

