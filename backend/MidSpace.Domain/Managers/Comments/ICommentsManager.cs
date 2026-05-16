using MidSpace.Domain.Dtos.SocialDtos;

namespace MidSpace.Domain.Managers.Comments
{
    public interface ICommentsManager
    {
        Task<CommentDto> AddCommentAsync(int postId, int userId, CreateCommentDto dto);
        Task<List<CommentDto>> GetPostCommentsAsync(int postId);
        Task<bool> DeleteCommentAsync(int commentId, int userId);
    }
}
