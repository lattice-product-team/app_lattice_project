import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = Constants.expoConfig?.extra?.apiUrl as string;
const SOCKET_URL = (API_URL?.replace('/api/v1', '').replace('/v1', '') || '').replace(/\/$/, '');
console.log('[Socket] Initializing with URL:', SOCKET_URL);

export const useSocket = () => {
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const appState = useRef(AppState.currentState);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      console.log('[Socket] Disconnected manually');
    }
  }, []);

  const connect = useCallback(() => {
    // Don't connect for guests or unauthenticated users
    if (!token || isGuest || !SOCKET_URL) return;

    // Avoid multiple connections
    if (socketRef.current?.connected) return;
    if (socketRef.current) disconnect();

    console.log('[Socket] Connecting to:', SOCKET_URL);

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'], // Prioritize websocket for tunnel stability
      timeout: 30000, // Increase timeout to 30s for slow tunnels
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      forceNew: true,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Mobile connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Mobile disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      if (err.message.includes('Authentication error')) {
        console.warn('[Socket] Auth error (token may be expired):', err.message);
        socketInstance.disconnect(); // Stop retrying
      } else {
        console.error('[Socket] Connection error:', err.message);
      }
    });

    socketRef.current = socketInstance;
  }, [token, isGuest, disconnect]);

  // Handle connection/disconnection based on token and guest mode
  useEffect(() => {
    if (token && !isGuest) {
      connect();
    } else {
      disconnect();
    }
    return () => {
      // Don't disconnect on every re-render, only on unmount or token change
    };
  }, [token, isGuest, connect, disconnect]);

  // Lifecycle management
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        connect();
      } else if (nextAppState.match(/inactive|background/)) {
        disconnect();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [connect, disconnect]);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    const currentSocket = socketRef.current;
    if (currentSocket) {
      currentSocket.on(event, callback);
      return () => {
        currentSocket.off(event, callback);
      };
    }
  }, []);

  return { isConnected, subscribe };
};
