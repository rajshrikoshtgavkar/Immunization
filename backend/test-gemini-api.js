const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyBw6R5LH1A08IThpYVT5EHuoxMxGR6ZAD8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

async function testGeminiAPI() {
  console.log('\n🔍 Testing Gemini API Configuration...\n');
  console.log('API Key:', GEMINI_API_KEY);
  console.log('API URL:', GEMINI_API_URL);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    console.log('📡 Sending test request to Gemini API...\n');

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: 'Hello, please respond with "API is working"'
          }]
        }]
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ SUCCESS! API is working correctly.\n');
    console.log('Response:', response.data.candidates[0].content.parts[0].text);
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('✅ Configuration is CORRECT - No issues found!\n');

  } catch (error) {
    console.log('❌ ERROR! API request failed.\n');
    console.log('Error Details:');
    console.log('-------------');

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      console.log('Status Code:', status);
      console.log('Error Message:', JSON.stringify(data, null, 2));
      console.log('\n' + '='.repeat(60) + '\n');

      // Diagnose specific errors
      if (status === 400) {
        console.log('🔴 DIAGNOSIS: BAD REQUEST (400)');
        console.log('Possible causes:');
        console.log('  - API key is invalid or malformed');
        console.log('  - API key format is incorrect');
        console.log('  - Request payload has errors\n');
        
        if (data.error?.message?.includes('API_KEY_INVALID')) {
          console.log('⚠️  CONFIRMED: API Key is INVALID');
          console.log('   The API key does not exist or has been deleted.\n');
        }
      } else if (status === 403) {
        console.log('🔴 DIAGNOSIS: FORBIDDEN (403)');
        console.log('Possible causes:');
        console.log('  - API key does not have permission');
        console.log('  - Generative AI API is not enabled');
        console.log('  - Billing is not enabled (if required)\n');
        console.log('✅ SOLUTION:');
        console.log('   1. Go to: https://console.cloud.google.com/');
        console.log('   2. Enable "Generative Language API"');
        console.log('   3. Check API key restrictions\n');
      } else if (status === 429) {
        console.log('🔴 DIAGNOSIS: RATE LIMIT EXCEEDED (429)');
        console.log('Your API quota has been exhausted.\n');
        console.log('Free Tier Limits:');
        console.log('  - 60 requests per minute');
        console.log('  - 1,500 requests per day\n');
        console.log('✅ SOLUTION:');
        console.log('   1. Wait for quota to reset (1 minute or 24 hours)');
        console.log('   2. Upgrade to paid tier for higher limits');
        console.log('   3. Check usage: https://aistudio.google.com/\n');
      } else if (status === 404) {
        console.log('🔴 DIAGNOSIS: NOT FOUND (404)');
        console.log('Possible causes:');
        console.log('  - API endpoint URL is incorrect');
        console.log('  - Model name is wrong\n');
      } else {
        console.log('🔴 DIAGNOSIS: UNKNOWN ERROR');
        console.log('Status code:', status);
        console.log('Check Google Cloud Console for more details.\n');
      }

    } else if (error.request) {
      console.log('🔴 DIAGNOSIS: NETWORK ERROR');
      console.log('No response received from server.');
      console.log('Possible causes:');
      console.log('  - No internet connection');
      console.log('  - Firewall blocking requests');
      console.log('  - DNS resolution failed\n');
    } else {
      console.log('🔴 DIAGNOSIS: REQUEST SETUP ERROR');
      console.log('Error:', error.message);
    }

    console.log('='.repeat(60) + '\n');
  }
}

// Run the test
testGeminiAPI();
