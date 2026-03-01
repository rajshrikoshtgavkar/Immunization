# Deployment & Testing Checklist

## ✅ Pre-Deployment Checklist

### Backend Setup
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] Navigate to `backend/` directory
- [ ] Run `npm install`
- [ ] Configure `.env` file with correct values
- [ ] Run `node seedAdmin.js` to create admin user
- [ ] Run `npm run dev` to start server
- [ ] Verify server running on http://localhost:5000
- [ ] Test MongoDB connection (check console logs)

### Frontend Setup
- [ ] Navigate to `frontend/` directory
- [ ] Run `npm install`
- [ ] Run `npm start` to start React app
- [ ] Verify app running on http://localhost:3000
- [ ] Check for compilation errors in console

## ✅ Testing Checklist

### Authentication Tests

#### Test 1: Admin Login
- [ ] Navigate to http://localhost:3000
- [ ] Enter email: `admin@vaccination.com`
- [ ] Enter password: `admin123`
- [ ] Click "Sign In"
- [ ] Verify redirect to `/admin/dashboard`
- [ ] Verify welcome message shows admin name
- [ ] Verify logout button works

#### Test 2: Invalid Login
- [ ] Navigate to http://localhost:3000/login
- [ ] Enter wrong email/password
- [ ] Click "Sign In"
- [ ] Verify error message displays
- [ ] Verify no redirect occurs

#### Test 3: Protected Route Access (Not Logged In)
- [ ] Logout if logged in
- [ ] Try to access http://localhost:3000/admin/dashboard
- [ ] Verify redirect to `/login`
- [ ] Try to access http://localhost:3000/parent/dashboard
- [ ] Verify redirect to `/login`

#### Test 4: Create Parent User (API)
- [ ] Login as admin
- [ ] Copy JWT token from localStorage (DevTools)
- [ ] Use Postman or curl:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test Parent",
    "email": "parent@test.com",
    "password": "parent123",
    "role": "parent"
  }'
```
- [ ] Verify 201 response with user data
- [ ] Verify user created in MongoDB

#### Test 5: Parent Login
- [ ] Logout admin
- [ ] Login with parent credentials
- [ ] Email: `parent@test.com`
- [ ] Password: `parent123`
- [ ] Verify redirect to `/parent/dashboard`
- [ ] Verify welcome message shows parent name

#### Test 6: Role-Based Access Control
- [ ] Login as parent
- [ ] Try to access http://localhost:3000/admin/dashboard
- [ ] Verify redirect to `/parent/dashboard`
- [ ] Logout and login as admin
- [ ] Try to access http://localhost:3000/parent/dashboard
- [ ] Verify redirect to `/admin/dashboard`

#### Test 7: Token Persistence
- [ ] Login as any user
- [ ] Refresh the page
- [ ] Verify user stays logged in
- [ ] Verify correct dashboard loads

#### Test 8: Unauthorized Registration
- [ ] Login as parent
- [ ] Copy JWT token
- [ ] Try to register new user with parent token
- [ ] Verify 403 Forbidden error
- [ ] Verify error message about authorization

### API Endpoint Tests

#### GET /api/auth/me
- [ ] Login and get token
- [ ] Send GET request with Authorization header
- [ ] Verify 200 response with user data
- [ ] Send request without token
- [ ] Verify 401 Unauthorized

#### POST /api/auth/login
- [ ] Valid credentials → 200 + token
- [ ] Invalid email → 401 error
- [ ] Invalid password → 401 error
- [ ] Missing fields → 400 error

#### POST /api/auth/register
- [ ] With admin token → 201 + user created
- [ ] With parent token → 403 Forbidden
- [ ] Without token → 401 Unauthorized
- [ ] Duplicate email → 400 error

### UI/UX Tests

#### Responsive Design
- [ ] Open DevTools
- [ ] Test mobile view (375px)
- [ ] Test tablet view (768px)
- [ ] Test desktop view (1920px)
- [ ] Verify all elements responsive
- [ ] Verify no horizontal scroll

#### Visual Tests
- [ ] Login page displays correctly
- [ ] Healthcare theme colors visible
- [ ] Icons render properly
- [ ] Buttons have hover effects
- [ ] Loading spinner shows during login
- [ ] Error messages styled correctly

#### Accessibility
- [ ] Tab through form inputs
- [ ] Verify focus indicators visible
- [ ] Test with screen reader (optional)
- [ ] Verify color contrast sufficient

### Security Tests

#### Password Security
- [ ] Check MongoDB - passwords are hashed
- [ ] Verify bcrypt salt rounds = 10
- [ ] Passwords not visible in API responses

#### Token Security
- [ ] JWT contains only user ID (not password)
- [ ] Token expires after 7 days
- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected (test after 7 days)

#### CORS
- [ ] Backend accepts requests from frontend
- [ ] Verify CORS headers in response

## ✅ Production Readiness Checklist

### Environment Configuration
- [ ] Change JWT_SECRET to strong random string
- [ ] Update MONGO_URI for production database
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Remove console.log statements

### Security Enhancements
- [ ] Implement rate limiting
- [ ] Add helmet.js for security headers
- [ ] Use HTTPS in production
- [ ] Consider HTTP-only cookies for tokens
- [ ] Add input sanitization
- [ ] Implement CSRF protection

### Performance
- [ ] Add database indexes (email field)
- [ ] Implement caching if needed
- [ ] Optimize bundle size
- [ ] Enable gzip compression

### Monitoring
- [ ] Add error logging (Winston, Morgan)
- [ ] Set up health check endpoint
- [ ] Monitor API response times
- [ ] Track authentication failures

## ✅ Documentation Checklist

- [✓] README.md - Complete documentation
- [✓] QUICKSTART.md - Setup guide
- [✓] IMPLEMENTATION_SUMMARY.md - Technical details
- [✓] RBAC_FLOW_DIAGRAM.md - Visual flows
- [✓] Postman collection - API testing
- [✓] Code comments - Inline documentation

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution**: 
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env
- Verify MongoDB port (default 27017)

### Issue: Port Already in Use
**Solution**:
- Change PORT in backend/.env
- Update API URL in AuthContext.js
- Kill process using port: `netstat -ano | findstr :5000`

### Issue: CORS Error
**Solution**:
- Verify backend CORS is enabled
- Check API URL in frontend matches backend
- Clear browser cache

### Issue: Token Not Working
**Solution**:
- Check token in localStorage (DevTools)
- Verify Authorization header format: "Bearer <token>"
- Check JWT_SECRET matches in .env
- Verify token not expired

### Issue: Cannot Create Parent User
**Solution**:
- Ensure logged in as admin
- Check Authorization header includes admin token
- Verify role field is "parent" (lowercase)

## 📊 Success Metrics

After completing all tests, you should have:
- ✅ 0 console errors
- ✅ All API endpoints responding correctly
- ✅ Role-based access working
- ✅ Responsive UI on all devices
- ✅ Secure password storage
- ✅ Token-based authentication functional

## 🎉 Module 1 Complete!

Once all items are checked, Module 1 is production-ready and you can proceed to Module 2.
