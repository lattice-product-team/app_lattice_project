export interface User {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  hasTicket?: boolean;
  avoidStairs?: boolean;
  avoidCrowds?: boolean;
  avoidSlopes?: boolean;
  avoidGrandstands?: boolean;
}

export interface Ticket {
  id: number;
  code: string;
  zoneName: string;
  gate: string;
  seatRow?: string;
  seatNumber?: string;
  isActive?: boolean;
  createdAt?: string;
}
