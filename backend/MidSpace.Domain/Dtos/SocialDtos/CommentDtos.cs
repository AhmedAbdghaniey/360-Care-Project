using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.SocialDtos
{
    public class CreateCommentDto
    {
        [Required, MaxLength(2000)]
        public string Content { get; set; } = string.Empty;
    }

    public class CommentDto
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserProfileImage { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
