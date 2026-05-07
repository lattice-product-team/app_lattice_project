import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Ticket } from '../types/models/auth';
import { mmkvStorage } from '../services/storage';

interface AuthState {
  token: string | null;
  user: User | null;
  activeTicket: Ticket | null;
  tickets: Ticket[];
  pendingTicketCode: string | null;
  isGuest: boolean;
  registrationRequired: boolean;
  prefilledEmail: string | null;
  intendedDestination: string | null;
  isAuthPromptOpen: boolean;

  // Setters
  setAuth: (token: string, user: User, tickets?: Ticket[], isGuest?: boolean) => void;
  setGuestMode: (isGuest: boolean) => void;
  setTicket: (ticket: Ticket) => void;
  setTickets: (tickets: Ticket[]) => void;
  addTicketToWallet: (ticket: Ticket) => void;
  setPendingTicketCode: (code: string | null) => void;
  setRegistrationRequired: (required: boolean, email?: string | null) => void;
  setIntendedDestination: (path: string | null) => void;
  openAuthPrompt: (destination?: string) => void;
  closeAuthPrompt: () => void;
  clearRegistrationData: () => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
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
  intendedDestination: null,
  isAuthPromptOpen: false,

  setAuth: (token, user, tickets, isGuest = false) =>
    set((state) => ({
      token,
      user,
      tickets: tickets ?? state.tickets ?? [],
      isGuest,
      registrationRequired: false,
      prefilledEmail: null,
    })),

  setGuestMode: (isGuest) => set({ isGuest }),

  setTicket: (ticket) =>
    set((state) => ({
      activeTicket: ticket,
      tickets: (state.tickets || []).some((t) => t.code === ticket.code)
        ? state.tickets || []
        : [...(state.tickets || []), ticket],
    })),

  setTickets: (tickets) => set({ tickets }),

  addTicketToWallet: (ticket) =>
    set((state) => ({
      tickets: (state.tickets || []).some((t) => t.code === ticket.code)
        ? state.tickets || []
        : [...(state.tickets || []), ticket],
    })),

  setPendingTicketCode: (code) => set({ pendingTicketCode: code }),

  setRegistrationRequired: (required, email = null) =>
    set({ registrationRequired: required, prefilledEmail: email }),

  clearRegistrationData: () =>
    set({ registrationRequired: false, prefilledEmail: null, pendingTicketCode: null }),

  setIntendedDestination: (path) => set({ intendedDestination: path }),

  openAuthPrompt: (dest) => set({ isAuthPromptOpen: true, intendedDestination: dest || null }),

  closeAuthPrompt: () => set({ isAuthPromptOpen: false }),

  updateUser: (userUpdates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userUpdates } : null,
    })),

  logout: () =>
    set({
      token: null,
      user: null,
      activeTicket: null,
      tickets: [],
      pendingTicketCode: null,
      isGuest: false,
      registrationRequired: false,
      prefilledEmail: null,
      intendedDestination: null,
      isAuthPromptOpen: false,
    }),
});

export const useAuthStore = create<AuthState>()(
  persist(createAuthStore, {
    name: 'auth-storage',
    storage: createJSONStorage(() => mmkvStorage),
  })
);
