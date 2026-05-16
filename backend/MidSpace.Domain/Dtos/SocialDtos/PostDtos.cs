using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.SocialDtos
{
    public class CreatePostDto
    {
        [Required, MaxLength(5000)]
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }

    public class UpdatePostDto
    {
        [Required, MaxLength(5000)]
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }

    public class PostDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserProfileImage { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int LikeCount { get; set; }
        public int CommentCount { get; set; }
        public bool IsLikedByMe { get; set; }
    }
}
