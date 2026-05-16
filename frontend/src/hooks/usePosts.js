import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';

export const postsKeys = {
  all: ['posts'],
  feed: (page) => ['posts', 'feed', page],
  detail: (id) => ['posts', id],
  userPosts: (userId) => ['posts', 'user', userId],
  comments: (postId) => ['comments', postId],
};

export function useFeed(page = 1) {
  return useQuery({
    queryKey: postsKeys.feed(page),
    queryFn: () => postsApi.getFeed(page).then((r) => r.data),
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: postsKeys.detail(id),
    queryFn: () => postsApi.getPost(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useUserPosts(userId) {
  return useQuery({
    queryKey: postsKeys.userPosts(userId),
    queryFn: () => postsApi.getUserPosts(userId).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => postsApi.createPost(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKeys.all });
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => postsApi.updatePost(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKeys.all });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => postsApi.deletePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKeys.all });
    },
  });
}

export function useLikePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => postsApi.likePost(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKeys.all });
    },
  });
}

export function useUnlikePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => postsApi.unlikePost(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKeys.all });
    },
  });
}

export function usePostComments(postId) {
  return useQuery({
    queryKey: postsKeys.comments(postId),
    queryFn: () => postsApi.getComments(postId).then((r) => r.data),
    enabled: !!postId,
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }) => postsApi.addComment(postId, data).then((r) => r.data),
    onSuccess: (_, { postId }) => {
      qc.invalidateQueries({ queryKey: postsKeys.comments(postId) });
      qc.invalidateQueries({ queryKey: postsKeys.detail(postId) });
    },
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, commentId }) => postsApi.deleteComment(postId, commentId),
    onSuccess: (_, { postId }) => {
      qc.invalidateQueries({ queryKey: postsKeys.comments(postId) });
      qc.invalidateQueries({ queryKey: postsKeys.detail(postId) });
    },
  });
}
