import api from './axios';

export const postsApi = {
  getFeed: (page = 1, pageSize = 20) =>
    api.get(`/feed?page=${page}&pageSize=${pageSize}`),

  getPost: (id) =>
    api.get(`/posts/${id}`),

  getUserPosts: (userId) =>
    api.get(`/posts/user/${userId}`),

  createPost: (data) =>
    api.post('/posts', data),

  updatePost: (id, data) =>
    api.put(`/posts/${id}`, data),

  deletePost: (id) =>
    api.delete(`/posts/${id}`),

  likePost: (id) =>
    api.post(`/posts/${id}/like`),

  unlikePost: (id) =>
    api.delete(`/posts/${id}/like`),

  getComments: (postId) =>
    api.get(`/posts/${postId}/comments`),

  addComment: (postId, data) =>
    api.post(`/posts/${postId}/comments`, data),

  deleteComment: (postId, commentId) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),
};
