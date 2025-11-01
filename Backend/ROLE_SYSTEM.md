# Role-Based Access Control (RBAC) System

## Overview

The AutoMex Backend now includes a comprehensive role-based access control system with three default roles:

- **normal** (ID: 1) - Standard user with basic permissions
- **admin** (ID: 2) - Administrator with elevated permissions
- **super** (ID: 3) - Super administrator with full system access

## Database Schema

### Role Table
```sql
CREATE TABLE role (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);
```

### User-Role Relationship
The `user` table has a foreign key `role_id` referencing `role.id`:
```sql
ALTER TABLE user ADD COLUMN role_id INTEGER NOT NULL DEFAULT 1 REFERENCES role(id);
```

## Default Behavior

### New User Registration
- All newly registered users are automatically assigned the **normal** role (role_id = 1)
- This happens automatically during the registration process
- No additional configuration needed

### Role Seeding
- Default roles are automatically seeded into the database on first startup
- If roles already exist, the seeding is skipped

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe",
  "phone_number": "+1234567890"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "is_active": true,
  "is_superuser": false,
  "is_verified": false,
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "role_id": 1,
  "role": {
    "id": 1,
    "name": "normal",
    "description": "Normal user with standard permissions"
  }
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <jwt_token>
```

**Response includes role information:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "role_id": 1,
  "role": {
    "id": 1,
    "name": "normal",
    "description": "Normal user with standard permissions"
  }
}
```

### Role Management Endpoints

#### Get All Roles
```http
GET /api/v1/roles
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "normal",
    "description": "Normal user with standard permissions"
  },
  {
    "id": 2,
    "name": "admin",
    "description": "Administrator with elevated permissions"
  },
  {
    "id": 3,
    "name": "super",
    "description": "Super admin with full system access"
  }
]
```

#### Get Role by ID
```http
GET /api/v1/roles/{role_id}
```

#### Create New Role (Admin/Super only)
```http
POST /api/v1/roles
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "moderator",
  "description": "Moderator with content management permissions"
}
```

**Permissions:** Requires `admin` or `super` role

#### Update Role (Admin/Super only)
```http
PUT /api/v1/roles/{role_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

**Permissions:** Requires `admin` or `super` role

#### Delete Role (Super only)
```http
DELETE /api/v1/roles/{role_id}
Authorization: Bearer <jwt_token>
```

**Permissions:** Requires `super` role
**Restrictions:** 
- Cannot delete default roles (IDs 1, 2, 3)
- Cannot delete roles that have users assigned to them

## Permission Checks

### In Your API Endpoints

You can check user roles in your endpoints:

```python
from fastapi import Depends, HTTPException, status
from automex_backend.api.auth import current_active_user
from automex_backend.models.user import User

@router.get("/admin-only")
async def admin_only_endpoint(user: User = Depends(current_active_user)):
    if user.role.name not in ["admin", "super"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return {"message": "Welcome, admin!"}
```

### Role-Based Permission Decorator (Optional Enhancement)

You can create a custom dependency for role checking:

```python
from typing import List
from fastapi import Depends, HTTPException, status

def require_roles(allowed_roles: List[str]):
    async def role_checker(user: User = Depends(current_active_user)):
        if user.role.name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return user
    return role_checker

# Usage
@router.get("/admin-endpoint")
async def admin_endpoint(user: User = Depends(require_roles(["admin", "super"]))):
    return {"message": "Admin content"}
```

## Frontend Integration

### Registration Response
When a user registers, the response includes their role:
```typescript
interface User {
  id: number;
  email: string;
  full_name?: string;
  phone_number?: string;
  role_id: number;
  role: {
    id: number;
    name: string;
    description: string;
  };
}
```

### Storing Role in Frontend
```typescript
// After login/registration
const user = await authService.loginUser(credentials);
localStorage.setItem('userRole', user.role.name);
```

### Role-Based UI Rendering
```typescript
// React example
const user = useAuth();

return (
  <>
    {user.role.name === 'admin' && (
      <AdminPanel />
    )}
    {user.role.name === 'super' && (
      <SuperAdminPanel />
    )}
  </>
);
```

## Migration Notes

### Existing Users
If you have existing users in your database before implementing this system:
1. The database migration will add the `role_id` column with a default value of 1 (normal)
2. All existing users will be assigned the "normal" role
3. You can manually update user roles via SQL or create an admin endpoint for role assignment

### Manual Role Assignment
To manually assign roles to users:
```sql
-- Make a user an admin
UPDATE user SET role_id = 2 WHERE email = 'admin@example.com';

-- Make a user a super admin
UPDATE user SET role_id = 3 WHERE email = 'superadmin@example.com';
```

## Security Best Practices

1. **Default Role**: Always use 'normal' as the default role for new registrations
2. **Role Elevation**: Only super admins should be able to create super admin accounts
3. **Audit Logging**: Consider logging all role changes for security auditing
4. **Role Validation**: Always validate user roles on the backend, never trust frontend checks alone
5. **Protected Endpoints**: Use role checks on sensitive API endpoints

## Testing

### Test User Creation with Role
```python
# In your tests
async def test_user_registration_assigns_normal_role():
    response = await client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "TestPass123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["role_id"] == 1
    assert data["role"]["name"] == "normal"
```

## Future Enhancements

Consider implementing:
- Permission-based access control (more granular than roles)
- Role inheritance (e.g., admin inherits normal permissions)
- Dynamic permission assignment to roles
- User role history tracking
- Multi-role assignment per user

