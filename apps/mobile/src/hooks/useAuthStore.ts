import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';
import { User, Ticket } from '../types/models/auth';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Native-only storage
const storage = Platform.OS !== 'web' ? new createMMKV() : null;

const mmkvStorage = {
  setItem: (name: string, value: string) => {
    if (storage) storage.set(name, value);
    else if (typeof window !== 'undefined') window.localStorage.setItem(name, value);
  },
  getItem: (name: string) => {
    if (storage) return storage.getString(name) ?? null;
    return typeof window !== 'undefined' ? window.localStorage.getItem(name) : null;
  },
  removeItem: (name: string) => {
    if (storage) storage.remove(name);
    else if (typeof window !== 'undefined') window.localStorage.removeItem(name);
  },
};

interface AuthState {
  token: string | null;
  user: User | null;
  activeTicket: Ticket | null;
  tickets: Ticket[]; // Wallet of all scanned tickets
  pendingTicketCode: string | null; // Stores scanned code if user needs to login/register
  isGuest: boolean; // True if logged in via Ticket Sync only
  registrationRequired: boolean; // True if ticket sync found an account with no password
  prefilledEmail: string | null;
  eventConfig: any | null; // Stores venue branding and event info
  setAuth: (token: string, user: User, tickets?: Ticket[], isGuest?: boolean) => void;
  setTicket: (ticket: Ticket) => void;
  setEventConfig: (config: any) => void;
  addTicketToWallet: (ticket: Ticket) => void;
  syncTickets: () => Promise<void>;
  setPendingTicketCode: (code: string | null) => void;
  setRegistrationRequired: (required: boolean, email?: string | null) => void;
  clearRegistrationData: () => void;
  claimTicket: (ticketCode: string) => Promise<boolean>;
  unclaimTicket: (ticketCode: string) => Promise<boolean>;
  logout: () => void;
}

const createAuthStore: StateCreator<AuthState, [['zustand/persist', unknown]]> = (set, get) => ({
  token: null,
  user: null,
  activeTicket: null,
  tickets: [],
  pendingTicketCode: null,
  isGuest: false,
  registrationRequired: false,
  prefilledEmail: null,
  eventConfig: null,
  setAuth: (token, user, tickets, isGuest = false) => 
    set((state) => ({ 
      token, 
      user, 
      tickets: tickets ?? state.tickets ?? [], 
      isGuest, 
      registrationRequired: false, 
      prefilledEmail: null 
    })),
  setTicket: (ticket) => set((state) => ({ 
    activeTicket: ticket,
    tickets: (state.tickets || []).some(t => t.code === ticket.code) 
      ? (state.tickets || [])
      : [...(state.tickets || []), ticket]
  })),
  setEventConfig: (config) => set({ eventConfig: config }),
  addTicketToWallet: (ticket) => set((state) => ({
    tickets: (state.tickets || []).some(t => t.code === ticket.code) 
      ? (state.tickets || [])
      : [...(state.tickets || []), ticket]
  })),
  syncTickets: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const tickets = await authService.getUserTickets(token);
      set({ tickets });
    } catch (error) {
      console.error('Error syncing tickets:', error);
    }
  },
  setPendingTicketCode: (code) => set({ pendingTicketCode: code }),
  setRegistrationRequired: (required, email = null) => set({ registrationRequired: required, prefilledEmail: email }),
  clearRegistrationData: () => set({ registrationRequired: false, prefilledEmail: null, pendingTicketCode: null }),
  claimTicket: async (ticketCode: string) => {
    const { token, setTicket, setPendingTicketCode } = get();
    
    let finalCode = ticketCode;
    try {
      const parsed = JSON.parse(ticketCode);
      if (parsed.code) finalCode = parsed.code;
    } catch {
      // Use raw code
    }

    try {
      const response = await apiClient.post<{ ticket_info: Ticket, tickets?: Ticket[] }>(
        API_ENDPOINTS.AUTH.TICKET_CLAIM, 
        { ticket_code: finalCode },
        token ?? undefined
      );

      if (response.ticket_info) {
        setTicket(response.ticket_info);
        if (response.tickets) {
          set({ tickets: response.tickets });
        }
        set({ user: { ...get().user!, hasTicket: true } }); // Update User State
        setPendingTicketCode(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error claiming ticket:', error);
      return false;
    }
  },
  unclaimTicket: async (ticketCode: string) => {
    const { token } = get();
    if (!token) return false;
    try {
      const response = await authService.unclaimTicket(ticketCode, token);
      set({ 
        tickets: response.tickets,
        activeTicket: response.tickets.length > 0 ? response.tickets[0] : null,
        user: get().user ? { ...get().user!, hasTicket: response.tickets.length > 0 } : null
      });
      return true;
    } catch (error) {
      console.error('Error unclaiming ticket:', error);
      return false;
    }
  },
  logout: () => set({ 
    token: null, 
    user: null, 
    activeTicket: null, 
    tickets: [], 
    pendingTicketCode: null, 
    isGuest: false,
    registrationRequired: false,
    prefilledEmail: null,
    eventConfig: null
  }),
});

export const useAuthStore = create<AuthState>()(
  persist(createAuthStore, {
    name: 'auth-storage',
    storage: createJSONStorage(() => mmkvStorage),
  })
);
