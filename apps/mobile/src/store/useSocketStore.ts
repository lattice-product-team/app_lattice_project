import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface SocketState {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  setIsConnected: (isConnected) => set({ isConnected }),
}));
