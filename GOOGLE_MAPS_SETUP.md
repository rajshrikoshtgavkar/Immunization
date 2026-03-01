# Google Maps API Setup Instructions

## Current Status
✅ **Module is working with MOCK DATA**
⚠️ **Google Places API needs to be enabled for real data**

---

## Quick Start (Using Mock Data)

The module is **already functional** with realistic mock data. You can:
- View nearby vaccination centers
- See interactive map with markers
- Filter by distance
- Get directions

**No additional setup needed for testing!**

---

## Enable Real Google Maps Data (Optional)

To use real vaccination center data from Google Places API:

### Step 1: Enable Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new one)
3. Navigate to **APIs & Services** > **Library**
4. Search for **"Places API"**
5. Click **Enable**

### Step 2: Enable Maps JavaScript API
1. In the same Library section
2. Search for **"Maps JavaScript API"**
3. Click **Enable**

### Step 3: Configure API Key Restrictions (Recommended)
1. Go to **APIs & Services** > **Credentials**
2. Click on your API key
3. Under **API restrictions**, select:
   - ✅ Places API
   - ✅ Maps JavaScript API
4. Under **Application restrictions**:
   - For development: Select "None"
   - For production: Add your domain

### Step 4: Verify Setup
Restart your backend server:
```bash
cd backend
npm run dev
```

You should see:
```
ℹ️  Using Google Places API for real data
```

Instead of:
```
ℹ️  Using mock vaccination center data
```

---

## API Key Already Configured

Your API key is already in `backend/.env`:
```
GOOGLE_MAPS_API_KEY=AIzaSyCVpx5k9KNMw3zKeizfMbfPgNIrVtA30YA
```

**Just enable the APIs in Google Cloud Console!**

---

## Troubleshooting

### Error: REQUEST_DENIED
**Cause**: Places API not enabled
**Solution**: Follow Step 1 above

### Error: OVER_QUERY_LIMIT
**Cause**: Free tier limit exceeded
**Solution**: 
- Use mock data (automatic fallback)
- Upgrade to paid plan
- Enable billing in Google Cloud

### Mock Data Shows Instead of Real Data
**Cause**: API not enabled or key invalid
**Solution**: 
- Check if Places API is enabled
- Verify API key is correct
- Check API key restrictions

---

## Mock Data vs Real Data

### Mock Data (Current)
- ✅ 7 realistic vaccination centers
- ✅ Government and private centers
- ✅ Ratings and open/closed status
- ✅ Distance calculations
- ✅ Works offline
- ❌ Not based on actual locations

### Real Data (After API Setup)
- ✅ Actual hospitals and clinics
- ✅ Real addresses and phone numbers
- ✅ Live open/closed status
- ✅ User reviews and ratings
- ✅ Accurate distances
- ✅ Up-to-date information

---

## Cost Information

**Google Maps Platform Pricing:**
- First $200/month: **FREE**
- Places API: $17 per 1,000 requests (after free tier)
- Maps JavaScript API: $7 per 1,000 loads (after free tier)

**Typical Usage:**
- Small clinic: ~100-500 requests/month = **FREE**
- Medium hospital: ~1,000-5,000 requests/month = **FREE**
- Large system: Monitor usage and set billing alerts

---

## Production Recommendations

1. **Enable Billing Alerts**
   - Set alert at $50, $100, $150
   - Monitor usage in Cloud Console

2. **Implement Caching**
   - Cache center results for 1 hour
   - Reduce API calls by 90%

3. **Rate Limiting**
   - Limit requests per user
   - Prevent abuse

4. **API Key Security**
   - Use separate keys for dev/prod
   - Rotate keys periodically
   - Set domain restrictions

---

## Summary

✅ **Module works NOW with mock data**
✅ **No setup required for testing**
✅ **Enable APIs for real data (optional)**
✅ **Free tier covers most use cases**

The system automatically falls back to mock data if the API is unavailable, ensuring the feature always works!
