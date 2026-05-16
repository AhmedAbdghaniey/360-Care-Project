using MidSpace.Domain.Dtos.SocialDtos;

namespace MidSpace.Domain.Managers.Follows
{
    public interface IFollowsManager
    {
        Task<bool> FollowUserAsync(int followerId, int followeeId);
        Task<bool> UnfollowUserAsync(int followerId, int followeeId);
        Task<List<FollowDto>> GetFollowersAsync(int userId);
        Task<List<FollowDto>> GetFollowingAsync(int userId);
        Task<bool> IsFollowingAsync(int followerId, int followeeId);
        Task<int> GetFollowerCountAsync(int userId);
        Task<int> GetFollowingCountAsync(int userId);
    }
}
