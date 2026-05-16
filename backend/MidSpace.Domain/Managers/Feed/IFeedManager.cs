using MidSpace.Domain.Dtos.SocialDtos;

namespace MidSpace.Domain.Managers.Feed
{
    public interface IFeedManager
    {
        Task<List<PostDto>> GetFeedAsync(int userId, int page = 1, int pageSize = 20);
    }
}
