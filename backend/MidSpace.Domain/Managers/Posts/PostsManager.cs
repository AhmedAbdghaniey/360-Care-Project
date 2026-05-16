using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.Social;
using MidSpace.Domain.Dtos.SocialDtos;

namespace MidSpace.Domain.Managers.Posts
{
    public class PostsManager : IPostsManager
    {
        private readonly ApplicationDbContext _context;

        public PostsManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PostDto> CreatePostAsync(int userId, CreatePostDto dto)
        {
            var post = new Post
            {
                UserId = userId,
                Content = dto.Content,
                ImageUrl = dto.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            return new PostDto
            {
                Id = post.Id,
                UserId = userId,
                UserName = user?.FullName ?? "",
                UserProfileImage = user?.ProfileImage,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                LikeCount = 0,
                CommentCount = 0,
                IsLikedByMe = false
            };
        }

        public async Task<PostDto?> GetPostByIdAsync(int id, int currentUserId)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

            if (post == null) return null;

            return ToDto(post, currentUserId);
        }

        public async Task<List<PostDto>> GetUserPostsAsync(int userId, int currentUserId)
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Where(p => p.UserId == userId && !p.IsDeleted)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return posts.Select(p => ToDto(p, currentUserId)).ToList();
        }

        public async Task<PostDto> UpdatePostAsync(int postId, int userId, UpdatePostDto dto)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == postId && p.UserId == userId && !p.IsDeleted);

            if (post == null)
                throw new KeyNotFoundException("Post not found or not owned by user");

            post.Content = dto.Content;
            post.ImageUrl = dto.ImageUrl;
            post.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ToDto(post, userId);
        }

        public async Task<bool> DeletePostAsync(int postId, int userId)
        {
            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == postId && p.UserId == userId && !p.IsDeleted);

            if (post == null) return false;

            post.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> LikePostAsync(int postId, int userId)
        {
            var existing = await _context.PostLikes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            if (existing != null) return false;

            _context.PostLikes.Add(new PostLike { PostId = postId, UserId = userId });
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnlikePostAsync(int postId, int userId)
        {
            var like = await _context.PostLikes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            if (like == null) return false;

            _context.PostLikes.Remove(like);
            await _context.SaveChangesAsync();
            return true;
        }

        private PostDto ToDto(Post post, int currentUserId)
        {
            return new PostDto
            {
                Id = post.Id,
                UserId = post.UserId,
                UserName = post.User?.FullName ?? "",
                UserProfileImage = post.User?.ProfileImage,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                LikeCount = post.Likes?.Count ?? 0,
                CommentCount = post.Comments?.Count ?? 0,
                IsLikedByMe = post.Likes?.Any(l => l.UserId == currentUserId) ?? false
            };
        }
    }
}
