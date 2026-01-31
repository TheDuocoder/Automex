
import asyncio
from sqlalchemy import text
from automex_backend.database import engine

async def check_and_add_column():
    async with engine.connect() as conn:
        # Check if column exists
        try:
            # This query works for SQLite and Postgres to list columns, but raw SQL is easier
            # Let's try to select the column, if it fails, it doesn't exist
            await conn.execute(text("SELECT warranty_details FROM costs LIMIT 1"))
            print("Column 'warranty_details' already exists.")
        except Exception as e:
            print(f"Column missing (Error: {e}). Adding column...")
            # If missing, add it.
            # Note: SQLite vs Postgres syntax is similar for ADD COLUMN
            try:
                # Assuming Postgres based on previous context, but if SQLite it also works
                await conn.execute(text("ALTER TABLE costs ADD COLUMN warranty_details VARCHAR(255)"))
                await conn.commit()
                print("Column 'warranty_details' added successfully.")
            except Exception as e2:
                print(f"Failed to add column: {e2}")

if __name__ == "__main__":
    asyncio.run(check_and_add_column())
