import { Env } from '../config/env';
import { getToken } from './storage';

const API_BASE_URL = Env.apiUrl;

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
      data,
    });

    // 1.3 Update handleResponse to include basic 401 handling
    if (response.status === 401) {
      // Logic for 401 can be handled here or via a callback/event
      console.warn('[API] 401 Unauthorized detected');
    }

    throw new Error(message);
  }

  return data as T;
}

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiClient = {
  get: async <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
    let urlString = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      urlString += `?${searchParams.toString()}`;
    }

    const response = await fetch(urlString, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return handleResponse<T>(response);
  },
};
