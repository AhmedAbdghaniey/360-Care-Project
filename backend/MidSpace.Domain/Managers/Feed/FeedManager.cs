using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Domain.Dtos.SocialDtos;

namespace MidSpace.Domain.Managers.Feed
{
    public class FeedManager : IFeedManager
    {
        private readonly ApplicationDbContext _context;

        public FeedManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PostDto>> GetFeedAsync(int userId, int page = 1, int pageSize = 20)
        {
            var followedUserIds = await _context.Follows
                .Where(f => f.FollowerId == userId)
                .Select(f => f.FolloweeId)
                .ToListAsync();

            var allUserIds = followedUserIds.Concat(new[] { userId }).ToList();

            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Where(p => allUserIds.Contains(p.UserId) && !p.IsDeleted)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return posts.Select(p =>
            {
                var likedUserIds = p.Likes?.Select(l => l.UserId).ToHashSet() ?? new HashSet<int>();
                return new PostDto
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    UserName = p.User?.FullName ?? "",
                    UserProfileImage = p.User?.ProfileImage,
                    Content = p.Content,
                    ImageUrl = p.ImageUrl,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    LikeCount = p.Likes?.Count ?? 0,
                    CommentCount = p.Comments?.Count ?? 0,
                    IsLikedByMe = likedUserIds.Contains(userId)
                };
            }).ToList();
        }
    }
}
