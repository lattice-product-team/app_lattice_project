import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';

export const useUserTickets = () => {
  const { setTickets } = useAuthStore();
  
  return useQuery({
    queryKey: ['user-tickets'],
    queryFn: async () => {
      const tickets = await authService.getUserTickets();
      setTickets(tickets);
      return tickets;
    },
  });
};

export const useClaimTicket = () => {
  const queryClient = useQueryClient();
  const { setTicket, updateUser, setPendingTicketCode } = useAuthStore();

  return useMutation({
    mutationFn: (ticketCode: string) => authService.claimTicket(ticketCode),
    onSuccess: (data) => {
      if (data.ticket_info) {
        setTicket(data.ticket_info);
        if (data.tickets) {
          useAuthStore.getState().setTickets(data.tickets);
        }
        updateUser({ hasTicket: true });
        setPendingTicketCode(null);
        queryClient.invalidateQueries({ queryKey: ['user-tickets'] });
      }
    },
  });
};

export const useUnclaimTicket = () => {
  const queryClient = useQueryClient();
  const { setTickets, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (ticketCode: string) => authService.unclaimTicket(ticketCode),
    onSuccess: (data) => {
      setTickets(data.tickets);
      updateUser({ hasTicket: data.tickets.length > 0 });
      queryClient.invalidateQueries({ queryKey: ['user-tickets'] });
    },
  });
};
