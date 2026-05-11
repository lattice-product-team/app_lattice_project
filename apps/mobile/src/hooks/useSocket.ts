import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = Constants.expoConfig?.extra?.apiUrl as string;
const SOCKET_URL = API_URL?.replace('/api/v1', '').replace('/v1', '') || '';

export const useSocket = () => {
  const token = useAuthStore((state) => state.token);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const appState = useRef(AppState.currentState);

  const connect = useCallback(() => {
    if (!token || !SOCKET_URL) return;

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

    setSocket(socketInstance);
  }, [token]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  // Handle connection/disconnection based on token
  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [token, connect, disconnect]);

  // Lifecycle management: Task 4.2
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('[Socket] App came to foreground, reconnecting...');
        connect();
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('[Socket] App went to background, disconnecting to save battery...');
        disconnect();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [connect, disconnect]);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    }
  }, [socket]);

  return { isConnected, subscribe };
};
