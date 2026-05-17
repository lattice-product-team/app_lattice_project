'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const getSocketUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // In production routing with Cloudflare Tunnels (subpath routing)
    if (host === 'projects.kore29.com') {
      return `${protocol}//${host}/lattice/api`;
    }
    
    return `${protocol}//${host}:3000`;
  }
  return 'http://localhost:3000';
};

const SOCKET_URL = getSocketUrl();

export const useSocket = (token?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In dev, we might not have a token yet, but we want to allow testing
    // The server will still validate the token if provided.
    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: token || 'dev-token', // Placeholder for dev
      },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    }
  }, [socket]);

  return { socket, isConnected, subscribe };
};
