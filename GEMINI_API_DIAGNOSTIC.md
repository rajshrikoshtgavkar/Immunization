# Gemini API Diagnostic Guide

## 🔍 Test Your API Key

Run this command to diagnose issues:

```bash
cd backend
node test-gemini-api.js
```

---

## 📋 Common Issues & Solutions

### ❌ Error 400: API_KEY_INVALID

**Problem:** Your API key is invalid or doesn't exist.

**Solution:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key
4. Update `backend/.env`:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
5. Restart backend server

---

### ❌ Error 403: PERMISSION_DENIED

**Problem:** Generative Language API is not enabled.

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** > **Library**
4. Search for **"Generative Language API"**
5. Click **Enable**
6. Wait 2-3 minutes
7. Restart backend server

---

### ❌ Error 429: RESOURCE_EXHAUSTED (Rate Limit)

**Problem:** You've exceeded the free tier quota.

**Free Tier Limits:**
- 60 requests per minute
- 1,500 requests per day

**Solution:**
1. **Wait:** Quota resets every minute/day
2. **Check Usage:** [Google AI Studio](https://aistudio.google.com/)
3. **Upgrade:** Enable billing for higher limits

**Temporary Fix:**
The chatbot will automatically use fallback responses when rate limited.

---

### ❌ Error 404: NOT_FOUND

**Problem:** API endpoint or model name is incorrect.

**Solution:**
Check that `geminiChatService.js` uses:
```javascript
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

---

## ✅ Verify Your API Key

### Method 1: Test Script
```bash
cd backend
node test-gemini-api.js
```

### Method 2: Manual Test
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

Replace `YOUR_API_KEY` with: `AIzaSyBw6R5LH1A08IThpYVT5EHuoxMxGR6ZAD8`

---

## 🔧 Check Backend Logs

When you start the backend, check for:

```
✅ Good:
Server running on port 5000
MongoDB Connected: localhost

❌ Bad:
Gemini API Error: 400
Gemini API Error: 403
Gemini API Error: 429
```

---

## 📊 Current API Key Status

**Your Key:** `AIzaSyBw6R5LH1A08IThpYVT5EHuoxMxGR6ZAD8`

**Possible Issues:**

1. **Key Invalid (400)**
   - Key doesn't exist
   - Key was deleted
   - Key format is wrong

2. **API Not Enabled (403)**
   - Generative Language API not enabled
   - Project doesn't have access
   - Billing not enabled (if required)

3. **Rate Limited (429)**
   - Too many requests
   - Free tier quota exceeded
   - Need to wait or upgrade

---

## 🚀 Quick Fix Steps

### Step 1: Get New API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy the new key

### Step 2: Update Configuration
Edit `backend/.env`:
```env
GEMINI_API_KEY=your_new_api_key_here
```

### Step 3: Enable API
1. Go to: https://console.cloud.google.com/
2. Enable **"Generative Language API"**

### Step 4: Restart Backend
```bash
cd backend
npm run dev
```

### Step 5: Test
```bash
node test-gemini-api.js
```

---

## 📞 Still Not Working?

### Check These:

1. **Internet Connection**
   - Can you access google.com?
   - Is firewall blocking requests?

2. **API Key Format**
   - Should start with `AIza`
   - Should be 39 characters long
   - No spaces or quotes

3. **Environment Variable**
   - Check `.env` file exists
   - No typos in `GEMINI_API_KEY`
   - Restart server after changes

4. **Google Cloud Project**
   - Project exists
   - Billing enabled (if required)
   - API enabled

---

## 💡 Fallback Behavior

**Good News:** Even if Gemini API fails, the chatbot will still work!

It will use rule-based responses for:
- Medicine information
- Dosage questions
- Side effects
- General health guidance

Users will still get helpful information.

---

## 📈 Monitor Usage

Check your API usage:
- [Google AI Studio](https://aistudio.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## ✅ Success Indicators

When everything works, you'll see:

**Backend Console:**
```
Server running on port 5000
MongoDB Connected: localhost
(No Gemini errors)
```

**Chatbot:**
- Intelligent, detailed responses
- Context-aware answers
- Natural language understanding

**Test Script:**
```
✅ SUCCESS! API is working correctly.
✅ Configuration is CORRECT - No issues found!
```

---

## 🎯 Next Steps

1. Run diagnostic: `node test-gemini-api.js`
2. Check the error message
3. Follow the solution for that specific error
4. Restart backend
5. Test chatbot in frontend

---

## 📝 Notes

- Free tier is usually sufficient for testing
- Rate limits reset every minute
- Fallback ensures chatbot always works
- No user data is sent to Gemini (privacy safe)
