// Test script to simulate Google OAuth token validation
const fetch = require('node-fetch');

async function testGoogleTokenInfo(accessToken) {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    const tokenInfo = await response.json();
    console.log('Token info:', tokenInfo);
    return tokenInfo;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

async function testBackendWithToken(accessToken) {
  try {
    const response = await fetch('https://project2-438-backend-c8e29941b290.herokuapp.com/teams', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', response.headers.raw());
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend data:', data.slice(0, 3));
    } else {
      const errorText = await response.text();
      console.log('Backend error:', errorText);
    }
  } catch (error) {
    console.error('Backend test error:', error);
  }
}

// Test with a dummy token to see the response
testBackendWithToken('dummy_token_for_testing');