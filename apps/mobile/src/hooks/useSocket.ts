import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/useAuthStore';
import { useSocketStore } from '../store/useSocketStore';

const API_URL = Constants.expoConfig?.extra?.apiUrl as string;
const SOCKET_URL = (API_URL?.replace('/api/v1', '').replace('/v1', '') || '').replace(/\/$/, '');

// Global socket instance to ensure singleton pattern
let globalSocket: Socket | null = null;
let connectionPromise: Promise<Socket> | null = null;

export const useSocket = () => {
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);
  
  // Use centralized store for connection state
  const isConnected = useSocketStore((state) => state.isConnected);
  const setIsConnected = useSocketStore((state) => state.setIsConnected);

  const disconnect = useCallback(() => {
    if (globalSocket) {
      console.log('[Socket] Disconnecting global instance');
      globalSocket.disconnect();
      globalSocket = null;
      connectionPromise = null;
      setIsConnected(false);
    }
  }, [setIsConnected]);

  const connect = useCallback(async () => {
    // Don't connect for guests or unauthenticated users
    if (!token || isGuest || !SOCKET_URL) return;

    // If already connected, just update state
    if (globalSocket?.connected) {
      setIsConnected(true);
      return;
    }

    // If connection is in progress, wait for it
    if (connectionPromise) return connectionPromise;

    const isProd = SOCKET_URL.includes('projects.kore29.com');
    const connectionUrl = isProd ? 'https://projects.kore29.com' : SOCKET_URL;
    const socketPath = isProd ? '/lattice/api/socket.io' : '/socket.io';

    console.log('[Socket] Connecting to:', connectionUrl, 'Path:', socketPath);

    connectionPromise = new Promise((resolve) => {
      const socketInstance = io(connectionUrl, {
        auth: { token },
        transports: ['polling', 'websocket'], // Restore polling as fallback for better compatibility
        path: socketPath,
        secure: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        forceNew: false,
        timeout: 10000,
      });

      globalSocket = socketInstance;

      socketInstance.on('connect', () => {
        console.log('[Socket] Connected SUCCESSFULLY! Transport:', socketInstance.io.engine.transport.name);
        setIsConnected(true);
        resolve(socketInstance);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('[Socket] Mobile disconnected. Reason:', reason);
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (err) => {
        if (err.message.includes('Authentication error')) {
          console.warn('[Socket] Auth Error (Invalid/Expired Token):', err.message);
          disconnect();
        } else {
          console.error('[Socket] Connection error:', err.message);
          // Don't disconnect on general errors to allow auto-reconnection
        }
      });
    });

    return connectionPromise;
  }, [token, isGuest, disconnect, setIsConnected]);

  // Handle connection/disconnection based on token and guest mode
  useEffect(() => {
    if (token && !isGuest) {
      connect();
    } else {
      disconnect();
    }
  }, [token, isGuest, connect, disconnect]);

  // Lifecycle management
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (AppState.currentState.match(/inactive|background/) && nextAppState === 'active') {
        // Only reconnect if we were supposed to be connected
        if (token && !isGuest) {
          connect();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [connect, token, isGuest]);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (globalSocket) {
      globalSocket.on(event, callback);
      return () => {
        globalSocket?.off(event, callback);
      };
    }
    // If socket isn't ready yet, this subscription will fail.
    // However, providers usually wait for isConnected before calling subscribe.
    return () => {};
  }, []);

  return { isConnected, subscribe };
};
