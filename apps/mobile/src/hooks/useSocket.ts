import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = Constants.expoConfig?.extra?.apiUrl as string;
const SOCKET_URL = API_URL?.replace('/api/v1', '') || '';

export const useSocket = () => {
  const token = useAuthStore((state) => state.token);
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
    if (!token || !SOCKET_URL) return;

    // Avoid multiple connections
    if (socketRef.current?.connected) return;
    if (socketRef.current) disconnect();

    console.log('[Socket] Connecting to:', SOCKET_URL);
    
    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
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
      console.error('[Socket] Connection error:', err.message);
    });

    socketRef.current = socketInstance;
  }, [token, disconnect]);

  // Handle connection/disconnection based on token
  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }
    return () => {
      // Don't disconnect on every re-render, only on unmount or token change
    };
  }, [token, connect, disconnect]);

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
