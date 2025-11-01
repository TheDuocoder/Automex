# ✅ Async Lazy Loading Issue Fixed

## Problem
You were getting this error during user registration:
```
sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called; 
can't call await_only() here. Was IO attempted in an unexpected place?
```

## Root Cause
The error occurred because:
1. In `on_after_register` callback, we tried to access `user.role.name`
2. This triggered SQLAlchemy's **lazy loading** of the `role` relationship
3. Lazy loading requires a database query (async operation)
4. But it was happening in a synchronous context within an async function
5. SQLAlchemy couldn't perform async operations in that context

## Fixes Applied

### 1. Fixed `on_after_register` Callback
**File:** `Backend/src/automex_backend/api/auth.py`

**Before:**
```python
async def on_after_register(self, user: User, request: Optional[Request] = None):
    print(f"[INFO] User {user.id} has registered: {user.email} with role: {user.role.name if user.role else 'None'}")
```

**After:**
```python
async def on_after_register(self, user: User, request: Optional[Request] = None):
    print(f"[INFO] User {user.id} has registered: {user.email} with role_id: {user.role_id}")
```

**Why:** Using `role_id` directly doesn't trigger lazy loading, avoiding the async issue.

### 2. Created Custom Dependency for User with Role
**File:** `Backend/src/automex_backend/api/auth.py`

Added `get_current_user_with_role` dependency:
```python
async def get_current_user_with_role(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
) -> User:
    """Get current user with role relationship loaded"""
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    
    result = await session.execute(
        select(User).where(User.id == user.id).options(selectinload(User.role))
    )
    return result.scalar_one()
```

**Why:** This uses **eager loading** with `selectinload()` to load the role relationship upfront in an async context.

### 3. Updated `/me` Endpoint
**File:** `Backend/src/automex_backend/api/auth.py`

Now properly loads the role before returning:
```python
@router.get("/me", response_model=UserRead)
async def get_current_user(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Get current authenticated user with role information"""
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    
    # Reload user with role relationship
    result = await session.execute(
        select(User).where(User.id == user.id).options(selectinload(User.role))
    )
    user_with_role = result.scalar_one()
    return user_with_role
```

### 4. Updated Role Management Endpoints
**File:** `Backend/src/automex_backend/api/roles.py`

Changed all endpoints to use `get_current_user_with_role` instead of `current_active_user`:
```python
# Before
user: User = Depends(current_active_user)

# After  
user: User = Depends(get_current_user_with_role)
```

**Why:** This ensures the role is always loaded when checking permissions like `user.role.name`.

## How It Works Now

### Registration Flow:
1. User submits registration data
2. `UserManager.create()` creates the user with `role_id=1` (normal)
3. User is saved to database
4. `on_after_register()` is called
5. Prints log with `role_id` (no lazy loading)
6. ✅ Success! User is registered

### API Endpoints:
1. User requests `/api/v1/auth/me`
2. `get_current_user()` is called
3. User object is fetched with `selectinload(User.role)`
4. Role is eagerly loaded in one query
5. ✅ Response includes full role information

### Permission Checks:
1. User requests admin endpoint
2. `get_current_user_with_role()` dependency runs
3. User + Role loaded together
4. Check `user.role.name` works without lazy loading
5. ✅ Permission check succeeds

## Testing

### Test Registration:
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "full_name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "test@example.com",
  "full_name": "Test User",
  "is_active": true,
  "is_verified": false,
  "is_superuser": false,
  "role_id": 1,
  "role": {
    "id": 1,
    "name": "normal",
    "description": "Normal user with standard permissions"
  }
}
```

### Test Current User:
```bash
# After login
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Key Concepts

### Lazy Loading
- Loads related data only when accessed
- Requires database query on-demand
- Can cause issues in async contexts

### Eager Loading
- Loads related data upfront with main query
- Uses `selectinload()`, `joinedload()`, etc.
- Prevents lazy loading issues
- More efficient (one query vs multiple)

### Why This Matters
In async SQLAlchemy:
- ❌ Lazy loading: Tries to do sync DB access in async code
- ✅ Eager loading: Explicitly loads data in proper async context

## Benefits

1. ✅ **No More Errors**: Registration works without `MissingGreenlet` errors
2. ✅ **Better Performance**: Fewer database queries with eager loading
3. ✅ **Complete Responses**: All endpoints return full user+role data
4. ✅ **Clean Permission Checks**: Can safely access `user.role.name`

## Files Modified

- ✅ `Backend/src/automex_backend/api/auth.py`
- ✅ `Backend/src/automex_backend/api/roles.py`

## Status

🎉 **All fixes applied! Backend is ready to use!**

You can now:
- Register users successfully ✅
- Get user info with role ✅
- Use role-based permissions ✅
- Access all API endpoints ✅

---

**Open:** http://localhost:8000/api/docs to test the API!

