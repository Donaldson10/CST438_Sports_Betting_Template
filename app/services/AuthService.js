import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

class AuthService {
  constructor() {
    this.redirectUri = AuthSession.makeRedirectUri({
      scheme: 'gambleapp',
      useProxy: true,
    });
    this.clientId = "965757428397-0qptrjl7r6q4427ur966okjn79erlvde.apps.googleusercontent.com";
  }

  async loginWithGoogle() {
    try {
      const request = new AuthSession.AuthRequest({
        clientId: this.clientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri: this.redirectUri,
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
          
          return { success: true, accessToken: tokenResponse.access_token, userInfo: userInfo };
        }
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async exchangeCodeForTokens(authCode) {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: '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',
          redirect_uri: this.redirectUri,
          code: authCode,
        }).toString(),
      });

      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  async getAccessToken() {
    return await AsyncStorage.getItem('accessToken');
  }

  async isAuthenticated() {
    return await AsyncStorage.getItem('isAuthenticated') === 'true';
  }

  async logout() {
    await AsyncStorage.multiRemove(['accessToken', 'isAuthenticated', 'userEmail', 'userName']);
    return { success: true };
  }
}

export default new AuthService();