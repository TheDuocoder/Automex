"""
Script to make a user an admin
"""
import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from automex_backend.database import get_async_session, engine
from automex_backend.models.user import User
from automex_backend.models.role import Role


async def make_user_admin(email: str):
    """Make a user an admin by email"""
    async with AsyncSession(engine) as session:
        # Find the user
        stmt = select(User).where(User.email == email)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"❌ User with email {email} not found")
            return
        
        # Find or create admin role
        role_stmt = select(Role).where(Role.name == "admin")
        role_result = await session.execute(role_stmt)
        admin_role = role_result.scalar_one_or_none()
        
        if not admin_role:
            print("⚠️  Admin role not found, creating it...")
            admin_role = Role(
                name="admin",
                description="Administrator with full system access"
            )
            session.add(admin_role)
            await session.flush()
            print(f"✅ Created admin role with ID: {admin_role.id}")
        
        # Update user
        user.role_id = admin_role.id
        user.is_superuser = True
        await session.commit()
        
        print(f"✅ Successfully made {email} an admin!")
        print(f"   User ID: {user.id}")
        print(f"   Role ID: {user.role_id}")
        print(f"   Is Superuser: {user.is_superuser}")


async def list_all_users():
    """List all users in the system"""
    async with AsyncSession(engine) as session:
        stmt = select(User)
        result = await session.execute(stmt)
        users = result.scalars().all()
        
        if not users:
            print("❌ No users found in database")
            return
        
        print("\n📋 All users in the system:")
        print("-" * 80)
        for user in users:
            print(f"ID: {user.id:3d} | Email: {user.email:40s} | Role ID: {user.role_id} | Superuser: {user.is_superuser}")
        print("-" * 80)
        

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python make_admin.py list                    - List all users")
        print("  python make_admin.py <email>                 - Make user admin")
        sys.exit(1)
    
    if sys.argv[1] == "list":
        asyncio.run(list_all_users())
    else:
        email = sys.argv[1]
        asyncio.run(make_user_admin(email))
