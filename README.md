# Vaccination Management System - Module 1: Authentication & RBAC

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **State Management**: Context API

## Project Structure

```
Vaccination/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── authController.js     # Auth logic (register, login, getMe)
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── models/
│   │   └── User.js               # User schema with role field
│   ├── routes/
│   │   └── authRoutes.js         # Auth endpoints
│   ├── utils/
│   │   └── generateToken.js      # JWT token generator
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.js   # Route protection component
    │   ├── context/
    │   │   └── AuthContext.js    # Global auth state
    │   ├── pages/
    │   │   ├── Login.js          # Login page with Tailwind
    │   │   ├── AdminDashboard.js # Admin-only dashboard
    │   │   └── ParentDashboard.js# Parent-only dashboard
    │   ├── App.js                # Main routing logic
    │   ├── index.js              # React entry point
    │   └── index.css             # Tailwind imports
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vaccination_db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB (ensure MongoDB is running on your system)

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Admin Only | Create new user (parent) |
| POST | `/api/auth/login` | Public | User login |
| GET | `/api/auth/me` | Protected | Get logged-in user data |

### Request/Response Examples

**Login:**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Register (Admin Only):**
```json
POST /api/auth/register
Headers: { "Authorization": "Bearer <admin_token>" }
{
  "name": "Parent User",
  "email": "parent@example.com",
  "password": "password123",
  "role": "parent"
}
```

## Role-Based Access Control (RBAC) Implementation

### How RBAC Works

#### 1. **User Model with Roles**
- User schema includes a `role` field with enum values: `["admin", "parent"]`
- Default role is `"parent"`
- Role is stored in database and returned with user data

#### 2. **JWT Token Authentication**
- On login, server generates JWT token containing user ID
- Token is sent to client and stored in localStorage
- Client includes token in Authorization header: `Bearer <token>`
- Backend middleware (`protect`) verifies token and attaches user to request

#### 3. **Authorization Middleware**
- `protect` middleware: Verifies JWT token and authenticates user
- `authorize(...roles)` middleware: Checks if authenticated user's role matches allowed roles
- If role doesn't match, returns 403 Forbidden error

#### 4. **Backend Route Protection**
```javascript
// Only admin can register new users
router.post('/register', protect, authorize('admin'), register);

// Any authenticated user can access their own data
router.get('/me', protect, getMe);
```

#### 5. **Frontend Route Protection**
- `PrivateRoute` component wraps protected routes
- Checks if user is authenticated (has valid token)
- Checks if user's role matches `allowedRoles` prop
- Redirects unauthorized users to appropriate dashboard

#### 6. **Role-Based Redirection**
After successful login:
- **Admin** → `/admin/dashboard`
- **Parent** → `/parent/dashboard`

Attempting to access wrong dashboard redirects to correct one based on role.

### Security Features

1. **Password Hashing**: bcrypt with salt rounds (10)
2. **JWT Expiration**: Tokens expire after 7 days
3. **Protected Routes**: All sensitive routes require authentication
4. **Role Verification**: Server-side role checks prevent privilege escalation
5. **Token Storage**: JWT stored in localStorage (can be upgraded to HTTP-only cookies)

## Testing the Application

### Create Admin User (Manual - First Time)

Since registration requires admin authentication, create the first admin user directly in MongoDB:

```javascript
// Using MongoDB shell or Compass
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // Use bcrypt to hash "password123"
  role: "admin",
  createdAt: new Date()
})
```

Or use this Node.js script:
```javascript
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vaccination_db');

const User = require('./models/User');

async function createAdmin() {
  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin"
  });
  console.log('Admin created:', admin);
  process.exit();
}

createAdmin();
```

### Login Flow

1. Open `http://localhost:3000`
2. Login with admin credentials
3. Redirected to `/admin/dashboard`
4. Admin can create parent users via API
5. Parent users can login and access `/parent/dashboard`

## UI Features

- **Modern Healthcare Theme**: Cyan/blue gradient with professional styling
- **Responsive Design**: Mobile-first approach using Tailwind
- **Loading States**: Spinner animations during authentication
- **Error Handling**: User-friendly error messages
- **Clean Navigation**: Role-specific dashboards with logout functionality

## Next Steps (Future Modules)

- Module 2: Child Management
- Module 3: Vaccination Schedule
- Module 4: Appointment Booking
- Module 5: Reports & Analytics

## License

MIT
