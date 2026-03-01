# Vaccination Center Locator - Troubleshooting Guide

## Issue 1: Google Maps API REQUEST_DENIED

### Problem
```
Error: Google Maps API error: REQUEST_DENIED
```

### Cause
- No valid Google Maps API key configured
- API key not enabled for Places API
- API key restrictions blocking requests

### Solution

#### Option A: Get Real Google Maps API Key (Recommended for Production)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Create new project or select existing

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search and enable:
     - **Places API**
     - **Maps JavaScript API**

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated key

5. **Configure in .env**
   ```env
   GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key_here
   ```

6. **Restart Server**
   ```bash
   npm run dev
   ```

#### Option B: Use Mock Data (For Testing Without API Key)

If you don't have a Google Maps API key yet, you can use mock data:

**Update `backend/services/vaccinationCenterService.js`:**

```javascript
// Add at the top of the file
const USE_MOCK_DATA = !process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here';

// Replace findNearbyCenters function
const findNearbyCenters = async (latitude, longitude, radius = 5000) => {
  try {
    // Use mock data if no API key
    if (USE_MOCK_DATA) {
      console.log('Using mock data - No Google Maps API key configured');
      return getMockCenters(latitude, longitude);
    }

    // ... rest of existing code
  } catch (error) {
    console.error('Error finding nearby centers:', error.message);
    throw error;
  }
};

// Add mock data function
const getMockCenters = (lat, lng) => {
  return [
    {
      id: 'mock_1',
      name: 'City Government Hospital',
      address: 'Main Road, City Center',
      location: { lat: lat + 0.01, lng: lng + 0.01 },
      rating: 4.5,
      isOpen: true,
      type: 'government',
      distance: 1.2
    },
    {
      id: 'mock_2',
      name: 'District Health Center',
      address: 'Health Complex, District Area',
      location: { lat: lat - 0.01, lng: lng + 0.01 },
      rating: 4.2,
      isOpen: true,
      type: 'government',
      distance: 2.5
    },
    {
      id: 'mock_3',
      name: 'Private Medical Center',
      address: 'Medical Plaza, Downtown',
      location: { lat: lat + 0.02, lng: lng - 0.01 },
      rating: 4.8,
      isOpen: false,
      type: 'private',
      distance: 3.1
    }
  ];
};
```

## Issue 2: Port 5000 Already in Use

### Problem
```
Error: listen EADDRINUSE: address already in use :::5000
```

### Cause
- Backend server already running in another terminal
- Another application using port 5000

### Solution

#### Option A: Kill Existing Process (Windows)

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Option B: Use Different Port

**Update `backend/.env`:**
```env
PORT=5001
```

**Update `frontend/src/api/centerApi.js`:**
```javascript
const API_URL = 'http://localhost:5001/api/centers';
```

#### Option C: Close Other Terminal

- Check if you have another terminal window with server running
- Press `Ctrl+C` to stop it
- Then restart in current terminal

## Quick Start (Without Google Maps API)

1. **Stop all running servers**
   ```bash
   # Press Ctrl+C in all terminal windows
   ```

2. **Use mock data temporarily**
   - Set in `.env`: `GOOGLE_MAPS_API_KEY=mock`
   - Apply Option B code changes above

3. **Restart backend**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start frontend** (new terminal)
   ```bash
   cd frontend
   npm start
   ```

5. **Test feature**
   - Login as parent
   - Click "Find Centers"
   - Should see mock data

## Verification Steps

### Check if API Key is Loaded
```bash
# In backend terminal, you should see:
Environment Check: {
  PORT: '5000',
  ...
}
```

### Check if Server Started
```bash
# Should see:
Server running on port 5000
MongoDB Connected: localhost
```

### Check Frontend Connection
- Open browser console (F12)
- Should see no CORS errors
- API calls should return data

## Common Issues

### Issue: "Failed to fetch vaccination centers"
**Solution**: Check if backend is running on correct port

### Issue: Location permission denied
**Solution**: 
- Click browser address bar lock icon
- Allow location permission
- Refresh page

### Issue: No centers showing
**Solution**:
- Check browser console for errors
- Verify API key is valid
- Try mock data option

## Production Deployment

Before deploying to production:

1. ✅ Get valid Google Maps API key
2. ✅ Enable billing on Google Cloud
3. ✅ Set API key restrictions
4. ✅ Monitor API usage
5. ✅ Set up error logging
6. ✅ Test with real locations

## Support

- Google Maps API: https://developers.google.com/maps/support
- Node.js Port Issues: Check Task Manager / Activity Monitor
- MongoDB Connection: Ensure MongoDB is running

## Quick Fix Summary

**For immediate testing without API key:**
1. Use mock data (Option B above)
2. Kill port 5000 process
3. Restart server
4. Test with mock centers

**For production:**
1. Get real Google Maps API key
2. Configure in .env
3. Enable required APIs
4. Test with real data
