import api from './axios';

export const followsApi = {
  follow: (followeeId) =>
    api.post(`/follows/${followeeId}`),

  unfollow: (followeeId) =>
    api.delete(`/follows/${followeeId}`),

  getFollowers: (userId) =>
    api.get(`/follows/followers/${userId}`),

  getFollowing: (userId) =>
    api.get(`/follows/following/${userId}`),

  isFollowing: (followeeId) =>
    api.get(`/follows/check/${followeeId}`),

  getCounts: (userId) =>
    api.get(`/follows/counts/${userId}`),
};
