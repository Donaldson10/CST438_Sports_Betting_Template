import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const BASE_URL = "https://project2-438-backend-c8e29941b290.herokuapp.com";

class AuthService {
  constructor() {
    this.redirectUri = AuthSession.makeRedirectUri({
      scheme: 'gambleapp',
      useProxy: true,
    });
    
    this.clientId = "965757428397-0qptrjl7r6q4427ur966okjn79erlvde.apps.googleusercontent.com";
    
    console.log('Auth Service initialized');
  }

  async loginWithGoogle() {
    try {
      const request = new AuthSession.AuthRequest({
        clientId: this.clientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri: this.redirectUri,
        additionalParameters: {},
        state: Math.random().toString(36).substring(7),
      });
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'success') {
        const authCode = result.params.code;
        const tokenResponse = await this.exchangeCodeForTokens(authCode);
        
        if (tokenResponse) {
          await AsyncStorage.setItem('accessToken', tokenResponse.access_token);
          await AsyncStorage.setItem('isAuthenticated', 'true');
          const userInfo = await this.getUserInfo(tokenResponse.access_token);
          if (userInfo) {
            await AsyncStorage.setItem('userEmail', userInfo.email);
            await AsyncStorage.setItem('userName', userInfo.name);
            await AsyncStorage.setItem('username', userInfo.email);
          }
          
          return {
            success: true,
            accessToken: tokenResponse.access_token,
            userInfo: userInfo
          };
        }
      }

      return { success: false, error: 'Authentication cancelled or failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async exchangeCodeForTokens(authCode) {
    try {
      // Exchange authorization code directly with Google (not your backend)
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: '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', // Your client secret
          redirect_uri: this.redirectUri,
          code: authCode,
        }).toString(),
      });

      if (response.ok) {
        const tokenData = await response.json();

        return tokenData;
      } else {
        console.error('Token exchange failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return null;
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      return null;
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Get user info error:', error);
      return null;
    }
  }

  async getAccessToken() {
    return await AsyncStorage.getItem('accessToken');
  }

  async isAuthenticated() {
    const token = await this.getAccessToken();
    const isAuth = await AsyncStorage.getItem('isAuthenticated');
    return token && isAuth === 'true';
  }

  async logout() {
    try {
      await AsyncStorage.multiRemove([
        'accessToken',
        'isAuthenticated',
        'userEmail',
        'userName'
      ]);


      const token = await this.getAccessToken();
      if (token) {
        await fetch(`${BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();