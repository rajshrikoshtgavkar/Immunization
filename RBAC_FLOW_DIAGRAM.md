# RBAC Flow Diagram

## Authentication Flow

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────────────┐
│  Express Server     │
│  authController.js  │
└──────┬──────────────┘
       │
       │ 2. Validate credentials
       │    - Find user by email
       │    - Compare password hash
       ▼
┌─────────────────┐
│   MongoDB       │
│   User Model    │
└──────┬──────────┘
       │
       │ 3. User found & password matches
       ▼
┌─────────────────────┐
│  Generate JWT       │
│  generateToken.js   │
└──────┬──────────────┘
       │
       │ 4. Return token + user data
       │    { token, data: { role, name, email } }
       ▼
┌─────────────────┐
│   Browser       │
│   AuthContext   │
└──────┬──────────┘
       │
       │ 5. Store token in localStorage
       │    Set user in state
       │
       │ 6. Redirect based on role
       ▼
┌─────────────────────────┐
│  Admin → /admin/dashboard  │
│  Parent → /parent/dashboard │
└─────────────────────────┘
```

## Protected Route Access Flow

```
┌─────────────┐
│   Browser   │
│  Navigate   │
└──────┬──────┘
       │
       │ 1. Access /admin/dashboard
       ▼
┌─────────────────────┐
│  PrivateRoute       │
│  Component          │
└──────┬──────────────┘
       │
       │ 2. Check authentication
       │    - Is user logged in?
       │    - Does role match?
       ▼
┌─────────────────┐
│  AuthContext    │
│  user state     │
└──────┬──────────┘
       │
       ├─── Not authenticated ───► Redirect to /login
       │
       ├─── Wrong role ──────────► Redirect to correct dashboard
       │
       └─── Authorized ──────────► Render component
                                    ▼
                              ┌─────────────────┐
                              │ AdminDashboard  │
                              └─────────────────┘
```

## API Request with Authorization

```
┌─────────────┐
│   Browser   │
│  Component  │
└──────┬──────┘
       │
       │ 1. GET /api/auth/me
       │    Headers: { Authorization: "Bearer <token>" }
       ▼
┌─────────────────────┐
│  Express Server     │
│  protect middleware │
└──────┬──────────────┘
       │
       │ 2. Extract token from header
       │    Verify JWT signature
       ▼
┌─────────────────┐
│  JWT Verify     │
│  jsonwebtoken   │
└──────┬──────────┘
       │
       ├─── Invalid token ────► 401 Unauthorized
       │
       └─── Valid token
            │
            │ 3. Decode user ID from token
            ▼
       ┌─────────────────┐
       │   MongoDB       │
       │   Find user     │
       └──────┬──────────┘
              │
              │ 4. Attach user to req.user
              ▼
       ┌─────────────────────┐
       │  authorize middleware│
       │  (if present)        │
       └──────┬──────────────┘
              │
              │ 5. Check if user.role in allowedRoles
              │
              ├─── Role not allowed ──► 403 Forbidden
              │
              └─── Role allowed
                   │
                   │ 6. Execute controller
                   ▼
              ┌─────────────────┐
              │  authController │
              │  getMe()        │
              └──────┬──────────┘
                     │
                     │ 7. Return user data
                     ▼
              ┌─────────────┐
              │   Browser   │
              │   Response  │
              └─────────────┘
```

## Role-Based Registration Flow

```
┌─────────────┐
│   Admin     │
│   Browser   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/register
       │    Headers: { Authorization: "Bearer <admin_token>" }
       │    Body: { name, email, password, role: "parent" }
       ▼
┌─────────────────────┐
│  Express Server     │
│  protect middleware │
└──────┬──────────────┘
       │
       │ 2. Verify admin token
       │    Fetch admin user
       ▼
┌─────────────────────────┐
│  authorize middleware   │
│  authorize('admin')     │
└──────┬──────────────────┘
       │
       │ 3. Check if user.role === 'admin'
       │
       ├─── Not admin ────────► 403 Forbidden
       │                        "User role parent is not authorized"
       │
       └─── Is admin
            │
            │ 4. Execute register controller
            ▼
       ┌─────────────────────┐
       │  authController     │
       │  register()         │
       └──────┬──────────────┘
              │
              │ 5. Create new parent user
              │    Hash password
              ▼
       ┌─────────────────┐
       │   MongoDB       │
       │   Insert user   │
       └──────┬──────────┘
              │
              │ 6. Return created user
              ▼
       ┌─────────────┐
       │   Admin     │
       │   Response  │
       └─────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────┐
│         Frontend (React)                 │
│  ┌────────────────────────────────────┐  │
│  │  Layer 1: UI Protection            │  │
│  │  - PrivateRoute component          │  │
│  │  - Role-based rendering            │  │
│  │  - Can be bypassed by user         │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
                    │
                    │ HTTP Request
                    │ Authorization: Bearer <token>
                    ▼
┌──────────────────────────────────────────┐
│         Backend (Express)                │
│  ┌────────────────────────────────────┐  │
│  │  Layer 2: Authentication           │  │
│  │  - protect middleware              │  │
│  │  - JWT verification                │  │
│  │  - Cannot be bypassed              │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Layer 3: Authorization            │  │
│  │  - authorize middleware            │  │
│  │  - Role verification               │  │
│  │  - Cannot be bypassed              │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│         Database (MongoDB)               │
│  ┌────────────────────────────────────┐  │
│  │  Layer 4: Data Integrity           │  │
│  │  - Schema validation               │  │
│  │  - Role enum constraint            │  │
│  │  - Unique email constraint         │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Token Lifecycle

```
┌─────────────────────────────────────────────────────┐
│                    Token Lifecycle                  │
└─────────────────────────────────────────────────────┘

1. CREATION
   ┌──────────────┐
   │ User Login   │
   └──────┬───────┘
          │
          ▼
   ┌──────────────────────┐
   │ Generate JWT         │
   │ Payload: { id }      │
   │ Secret: JWT_SECRET   │
   │ Expiry: 7 days       │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ Return to client     │
   └──────────────────────┘

2. STORAGE
   ┌──────────────────────┐
   │ localStorage.setItem │
   │ ('token', jwt)       │
   └──────────────────────┘

3. USAGE
   ┌──────────────────────┐
   │ Every API request    │
   │ Header:              │
   │ Authorization:       │
   │ Bearer <token>       │
   └──────────────────────┘

4. VERIFICATION
   ┌──────────────────────┐
   │ Backend middleware   │
   │ jwt.verify(token)    │
   └──────┬───────────────┘
          │
          ├─── Valid ──────► Continue
          │
          └─── Invalid ───► 401 Error

5. EXPIRATION
   ┌──────────────────────┐
   │ After 7 days         │
   │ Token expires        │
   │ User must re-login   │
   └──────────────────────┘

6. LOGOUT
   ┌──────────────────────┐
   │ localStorage.remove  │
   │ User state cleared   │
   └──────────────────────┘
```

## Role Comparison Matrix

```
┌─────────────────────┬──────────┬──────────┐
│      Action         │  Admin   │  Parent  │
├─────────────────────┼──────────┼──────────┤
│ Login               │    ✓     │    ✓     │
│ View own profile    │    ✓     │    ✓     │
│ Register new users  │    ✓     │    ✗     │
│ Access admin dash   │    ✓     │    ✗     │
│ Access parent dash  │    ✗     │    ✓     │
│ Manage children     │    ✗     │    ✓*    │
│ View all users      │    ✓*    │    ✗     │
│ System settings     │    ✓*    │    ✗     │
└─────────────────────┴──────────┴──────────┘

* = Future modules
```
