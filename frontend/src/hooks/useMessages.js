import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as messagesApi from '../api/messages';

export const useConversations = () =>
  useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
  });

export const useMessages = (userId) =>
  useQuery({
    queryKey: ['messages', userId],
    queryFn: () => messagesApi.getMessages(userId),
    enabled: !!userId,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};
