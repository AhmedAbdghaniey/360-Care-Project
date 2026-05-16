import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followsApi } from '../api/follows';

export const followKeys = {
  all: ['follows'],
  followers: (userId) => ['follows', 'followers', userId],
  following: (userId) => ['follows', 'following', userId],
  check: (followerId, followeeId) => ['follows', 'check', followerId, followeeId],
  counts: (userId) => ['follows', 'counts', userId],
};

export function useFollowers(userId) {
  return useQuery({
    queryKey: followKeys.followers(userId),
    queryFn: () => followsApi.getFollowers(userId).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useFollowing(userId) {
  return useQuery({
    queryKey: followKeys.following(userId),
    queryFn: () => followsApi.getFollowing(userId).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useIsFollowing(followeeId) {
  return useQuery({
    queryKey: followKeys.check('me', followeeId),
    queryFn: () => followsApi.isFollowing(followeeId).then((r) => r.data),
    enabled: !!followeeId,
  });
}

export function useFollowCounts(userId) {
  return useQuery({
    queryKey: followKeys.counts(userId),
    queryFn: () => followsApi.getCounts(userId).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (followeeId) => followsApi.follow(followeeId).then((r) => r.data),
    onSettled: () => qc.invalidateQueries({ queryKey: followKeys.all }),
  });
}

export function useUnfollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (followeeId) => followsApi.unfollow(followeeId).then((r) => r.data),
    onSettled: () => qc.invalidateQueries({ queryKey: followKeys.all }),
  });
}
