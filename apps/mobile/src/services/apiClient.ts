import { DEFAULT_API_URL } from '../constants/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

export interface ApiError {
  error?: {
    user_friendly_message?: string;
    code?: string;
  };
}

export async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorData = data as any;
    
    // Robust error message extraction
    let message = 'Unexpected server error';
    
    if (errorData.error) {
      if (typeof errorData.error === 'string') {
        message = errorData.error;
      } else if (typeof errorData.error === 'object') {
        message = errorData.error.message || errorData.error.user_friendly_message || message;
      }
    } else if (errorData.message) {
      message = errorData.message;
    }

    console.error(`[API Error] ${response.status}: ${message}`, {
      status: response.status,
      url: response.url,
      data
    });
    
    throw new Error(message);
  }

  return data as T;
}

export const apiClient = {
  get: async <T>(endpoint: string, params?: Record<string, string>, token?: string): Promise<T> => {
    let urlString = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      urlString += `?${searchParams.toString()}`;
    }

    const response = await fetch(urlString, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, body: any, token?: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, body: any, token?: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string, token?: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    return handleResponse<T>(response);
  },
};
