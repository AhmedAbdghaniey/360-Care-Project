using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.Social;
using MidSpace.Domain.Dtos.SocialDtos;

namespace MidSpace.Domain.Managers.Comments
{
    public class CommentsManager : ICommentsManager
    {
        private readonly ApplicationDbContext _context;

        public CommentsManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CommentDto> AddCommentAsync(int postId, int userId, CreateCommentDto dto)
        {
            var postExists = await _context.Posts.AnyAsync(p => p.Id == postId && !p.IsDeleted);
            if (!postExists)
                throw new KeyNotFoundException("Post not found");

            var comment = new Comment
            {
                PostId = postId,
                UserId = userId,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            return new CommentDto
            {
                Id = comment.Id,
                PostId = postId,
                UserId = userId,
                UserName = user?.FullName ?? "",
                UserProfileImage = user?.ProfileImage,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt
            };
        }

        public async Task<List<CommentDto>> GetPostCommentsAsync(int postId)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.PostId == postId && !c.IsDeleted)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return comments.Select(c => new CommentDto
            {
                Id = c.Id,
                PostId = c.PostId,
                UserId = c.UserId,
                UserName = c.User?.FullName ?? "",
                UserProfileImage = c.User?.ProfileImage,
                Content = c.Content,
                CreatedAt = c.CreatedAt
            }).ToList();
        }

        public async Task<bool> DeleteCommentAsync(int commentId, int userId)
        {
            var comment = await _context.Comments
                .FirstOrDefaultAsync(c => c.Id == commentId && c.UserId == userId && !c.IsDeleted);

            if (comment == null) return false;

            comment.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
