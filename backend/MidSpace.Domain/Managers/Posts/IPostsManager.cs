using MidSpace.Domain.Dtos.SocialDtos;

namespace MidSpace.Domain.Managers.Posts
{
    public interface IPostsManager
    {
        Task<PostDto> CreatePostAsync(int userId, CreatePostDto dto);
        Task<PostDto?> GetPostByIdAsync(int id, int currentUserId);
        Task<List<PostDto>> GetUserPostsAsync(int userId, int currentUserId);
        Task<PostDto> UpdatePostAsync(int postId, int userId, UpdatePostDto dto);
        Task<bool> DeletePostAsync(int postId, int userId);
        Task<bool> LikePostAsync(int postId, int userId);
        Task<bool> UnlikePostAsync(int postId, int userId);
    }
}
