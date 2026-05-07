
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

  async login(credentials: any) {
    const response = await fetch(`${AuthService.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Login failed');
    }
    return data;
  }

  async register(data: any) {
    const response = await fetch(`${AuthService.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || 'Registration failed');
    }
    return responseData;
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
