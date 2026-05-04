
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../store/useAuthStore';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  private static get API_URL() {
    return Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api/v1';
  }



  static async signInWithGoogle(idToken: string) {
    try {
      const response = await fetch(`${this.API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();
      if (data.token) {
        useAuthStore.getState().setAuth(data.token, data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  static async registerPasskey() {
    try {
      // 1. Get challenge from backend
      const challengeRes = await fetch(`${this.API_URL}/auth/passkey/register-challenge`, {
        headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` }
      });
      const options = await challengeRes.json();

      // 2. Create credential natively
      // Note: react-native-passkey would be used here
      console.log('Passkey registration initiated with options:', options);
      
      // MOCK for now
      const mockCredential = { id: 'mock_cred_id', rawId: '...', response: { clientDataJSON: '...', attestationObject: '...' } };

      // 3. Send attestation to backend
      const verifyRes = await fetch(`${this.API_URL}/auth/passkey/register-verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`
        },
        body: JSON.stringify(mockCredential),
      });

      return await verifyRes.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  static async signInWithPasskey() {
    try {
      // 1. Get assertion challenge
      const challengeRes = await fetch(`${this.API_URL}/auth/passkey/login-challenge`);
      const options = await challengeRes.json();

      // 2. Get assertion natively
      console.log('Passkey login initiated with options:', options);
      const mockAssertion = { id: 'mock_cred_id', response: { clientDataJSON: '...', authenticatorData: '...', signature: '...' } };

      // 3. Verify with backend
      const verifyRes = await fetch(`${this.API_URL}/auth/passkey/login-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockAssertion),
      });

      const data = await verifyRes.json();
      if (data.token) {
        useAuthStore.getState().setAuth(data.token, data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  async login(credentials: any) {
    const response = await fetch(`${AuthService.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  }

  async register(data: any) {
    const response = await fetch(`${AuthService.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getUserTickets() {
    const response = await fetch(`${AuthService.API_URL}/auth/tickets`, {
      headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` }
    });
    return response.json();
  }

  async claimTicket(code: string) {
    const response = await fetch(`${AuthService.API_URL}/auth/ticket/claim`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useAuthStore.getState().token}`
      },
      body: JSON.stringify({ ticket_code: code }),
    });
    return response.json();
  }

  async unclaimTicket(code: string) {
    const response = await fetch(`${AuthService.API_URL}/auth/ticket/unclaim`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useAuthStore.getState().token}`
      },
      body: JSON.stringify({ ticket_code: code }),
    });
    return response.json();
  }
}

export const authService = new AuthService();
