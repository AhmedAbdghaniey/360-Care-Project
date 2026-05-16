using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.Social;
using MidSpace.Domain.Dtos.SocialDtos;

namespace MidSpace.Domain.Managers.Follows
{
    public class FollowsManager : IFollowsManager
    {
        private readonly ApplicationDbContext _context;

        public FollowsManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> FollowUserAsync(int followerId, int followeeId)
        {
            if (followerId == followeeId) return false;

            var existing = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);

            if (existing != null) return false;

            _context.Follows.Add(new Follow { FollowerId = followerId, FolloweeId = followeeId });
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnfollowUserAsync(int followerId, int followeeId)
        {
            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);

            if (follow == null) return false;

            _context.Follows.Remove(follow);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<FollowDto>> GetFollowersAsync(int userId)
        {
            var followers = await _context.Follows
                .Include(f => f.Follower)
                .Where(f => f.FolloweeId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return followers.Select(f => new FollowDto
            {
                Id = f.Id,
                UserId = f.FollowerId,
                UserName = f.Follower?.FullName ?? "",
                UserProfileImage = f.Follower?.ProfileImage,
                FollowedAt = f.CreatedAt
            }).ToList();
        }

        public async Task<List<FollowDto>> GetFollowingAsync(int userId)
        {
            var following = await _context.Follows
                .Include(f => f.Followee)
                .Where(f => f.FollowerId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return following.Select(f => new FollowDto
            {
                Id = f.Id,
                UserId = f.FolloweeId,
                UserName = f.Followee?.FullName ?? "",
                UserProfileImage = f.Followee?.ProfileImage,
                FollowedAt = f.CreatedAt
            }).ToList();
        }

        public async Task<bool> IsFollowingAsync(int followerId, int followeeId)
        {
            return await _context.Follows
                .AnyAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);
        }

        public async Task<int> GetFollowerCountAsync(int userId)
        {
            return await _context.Follows.CountAsync(f => f.FolloweeId == userId);
        }

        public async Task<int> GetFollowingCountAsync(int userId)
        {
            return await _context.Follows.CountAsync(f => f.FollowerId == userId);
        }
    }
}
