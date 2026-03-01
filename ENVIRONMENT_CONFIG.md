# Environment Configuration Examples

## Development Environment (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/vaccination_db

# JWT Configuration
JWT_SECRET=dev_secret_key_change_in_production_12345
JWT_EXPIRE=7d

# CORS (Allow all in development)
CORS_ORIGIN=*
```

## Production Environment (.env.production)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (MongoDB Atlas or Production Server)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vaccination_db?retryWrites=true&w=majority

# JWT Configuration (Use strong random secret)
JWT_SECRET=your_super_secure_random_secret_key_min_32_chars_long
JWT_EXPIRE=7d

# CORS (Restrict to frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Optional: Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing Environment (.env.test)

```env
# Server Configuration
PORT=5001
NODE_ENV=test

# Database Configuration (Separate test database)
MONGO_URI=mongodb://localhost:27017/vaccination_test_db

# JWT Configuration
JWT_SECRET=test_secret_key_12345
JWT_EXPIRE=1d

# CORS
CORS_ORIGIN=*
```

## Frontend Environment Variables

### Development (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Production (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

## How to Use

### Backend
1. Copy the appropriate environment template
2. Create `.env` file in `backend/` directory
3. Update values according to your environment
4. Never commit `.env` to version control

### Frontend
1. Create `.env` file in `frontend/` directory
2. Add environment-specific variables
3. Access in code: `process.env.REACT_APP_API_URL`
4. Restart dev server after changes

## Generating Secure JWT Secret

### Method 1: Node.js
```javascript
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 2: OpenSSL
```bash
openssl rand -base64 64
```

### Method 3: Online Generator
Use a secure random string generator (minimum 32 characters)

## MongoDB Connection Strings

### Local MongoDB
```
mongodb://localhost:27017/vaccination_db
```

### MongoDB with Authentication
```
mongodb://username:password@localhost:27017/vaccination_db
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/vaccination_db?retryWrites=true&w=majority
```

### MongoDB Replica Set
```
mongodb://host1:27017,host2:27017,host3:27017/vaccination_db?replicaSet=myReplicaSet
```

## Security Best Practices

1. **Never commit .env files**
   - Add `.env` to `.gitignore`
   - Use `.env.example` as template

2. **Use different secrets per environment**
   - Development: Simple for debugging
   - Production: Strong random strings

3. **Rotate secrets regularly**
   - Change JWT_SECRET periodically
   - Update database passwords

4. **Restrict CORS in production**
   - Only allow your frontend domain
   - Never use `*` in production

5. **Use environment-specific databases**
   - Separate dev, test, and production databases
   - Never test on production data

## Environment Variables Checklist

### Required Variables
- [✓] PORT
- [✓] NODE_ENV
- [✓] MONGO_URI
- [✓] JWT_SECRET
- [✓] JWT_EXPIRE

### Optional Variables (Future Enhancements)
- [ ] CORS_ORIGIN
- [ ] RATE_LIMIT_WINDOW
- [ ] RATE_LIMIT_MAX_REQUESTS
- [ ] EMAIL_HOST (for notifications)
- [ ] EMAIL_PORT
- [ ] EMAIL_USER
- [ ] EMAIL_PASSWORD
- [ ] AWS_ACCESS_KEY (for file uploads)
- [ ] AWS_SECRET_KEY
- [ ] AWS_BUCKET_NAME

## Troubleshooting

### Issue: Environment variables not loading
**Solution**:
- Verify `.env` file is in correct directory
- Check file name is exactly `.env` (not `.env.txt`)
- Restart server after changes
- Verify `dotenv` package is installed

### Issue: MongoDB connection fails
**Solution**:
- Check MONGO_URI format
- Verify MongoDB is running
- Check network connectivity
- Verify credentials if using authentication

### Issue: JWT errors
**Solution**:
- Ensure JWT_SECRET is set
- Verify JWT_SECRET is same across restarts
- Check token expiration time format (e.g., "7d", "24h")

## Example .env.example Template

Create this file to share with team (without sensitive values):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/vaccination_db

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=*
```

Team members copy this to `.env` and fill in their values.
