import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Ticket, User } from '../types/models/auth';

export interface AuthResponse {
  token: string;
  user: User;
  tickets: Ticket[];
  requires_setup?: boolean;
  ticket_info?: Ticket;
}

export interface ClaimTicketResponse {
  ticket_info: Ticket;
  tickets?: Ticket[];
}

export const authService = {
  login: async (payload: any): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
  },

  register: async (payload: any): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  ticketSync: async (payload: any): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.TICKET_SYNC, payload);
  },

  claimTicket: async (ticketCode: string): Promise<ClaimTicketResponse> => {
    return apiClient.post<ClaimTicketResponse>(
      API_ENDPOINTS.AUTH.TICKET_CLAIM, 
      { ticket_code: ticketCode }
    );
  },

  getMe: async (): Promise<User> => {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  updateMe: async (data: Partial<User>): Promise<User> => {
    return apiClient.patch<User>(API_ENDPOINTS.AUTH.ME, data);
  },

  getUserTickets: async (): Promise<Ticket[]> => {
    return apiClient.get<Ticket[]>(API_ENDPOINTS.AUTH.TICKET_WALLET);
  },
  
  unclaimTicket: async (ticketCode: string): Promise<{ tickets: Ticket[] }> => {
    return apiClient.post<{ tickets: Ticket[] }>(
      API_ENDPOINTS.AUTH.TICKET_UNCLAIM,
      { ticket_code: ticketCode }
    );
  },
};
