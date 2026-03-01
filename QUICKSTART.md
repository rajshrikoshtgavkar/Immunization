# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation & Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Configure Environment
Edit `backend/.env` with your MongoDB connection string:
```env
MONGO_URI=mongodb://localhost:27017/vaccination_db
```

### 4. Create Admin User
```bash
cd backend
node seedAdmin.js
```

This creates:
- Email: `admin@vaccination.com`
- Password: `admin123`

### 5. Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

### 6. Start Frontend (New Terminal)
```bash
cd frontend
npm start
```
App runs on: http://localhost:3000

## Test the Application

1. **Login as Admin:**
   - Email: `admin@vaccination.com`
   - Password: `admin123`
   - Redirects to: `/admin/dashboard`

2. **Create Parent User (via API):**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Parent User",
    "email": "parent@example.com",
    "password": "parent123",
    "role": "parent"
  }'
```

3. **Login as Parent:**
   - Email: `parent@example.com`
   - Password: `parent123`
   - Redirects to: `/parent/dashboard`

## Features Implemented

✅ JWT-based authentication
✅ Role-based access control (Admin/Parent)
✅ Protected routes (frontend & backend)
✅ Password hashing with bcrypt
✅ Responsive UI with Tailwind CSS
✅ Context API for state management
✅ Role-aware redirection
✅ Secure token storage

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGO_URI in .env file

**Port Already in Use:**
- Change PORT in backend/.env
- Update API URL in frontend/src/context/AuthContext.js

**CORS Error:**
- Backend has CORS enabled for all origins in development
- For production, configure specific origins

## Project Structure
```
Vaccination/
├── backend/          # Express API
├── frontend/         # React App
└── README.md         # Full documentation
```

Refer to README.md for detailed documentation.
