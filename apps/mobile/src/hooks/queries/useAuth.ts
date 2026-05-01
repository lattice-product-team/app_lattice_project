import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/AuthService';

export const useLogin = () => {
  const pendingTicketCode = useAuthStore((state) => state.pendingTicketCode);

  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      return authService.login({
        email,
        password,
        ticket_code: pendingTicketCode || undefined,
      });
    },
    onSuccess: (data) => {
      const { setAuth, setTicket } = useAuthStore.getState();
      setAuth(data.token, data.user, data.tickets || [], false);
      if (data.ticket_info) {
        setTicket(data.ticket_info);
      }
      useAuthStore.getState().setPendingTicketCode(null);
    },
  });
};

export const useRegister = () => {
  const pendingTicketCode = useAuthStore((state) => state.pendingTicketCode);

  return useMutation({
    mutationFn: async ({ email, password, fullName }: any) => {
      return authService.register({
        email,
        password,
        fullName,
        ticket_code: pendingTicketCode || undefined,
      });
    },
    onSuccess: (data) => {
      const { setAuth } = useAuthStore.getState();
      setAuth(data.token, data.user, data.tickets || [], false);
      if (data.ticket_info) {
        useAuthStore.getState().setTicket(data.ticket_info);
      }
      useAuthStore.getState().setPendingTicketCode(null);
    },
  });
};
