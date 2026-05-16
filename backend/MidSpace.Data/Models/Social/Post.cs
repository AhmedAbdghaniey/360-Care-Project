using System.ComponentModel.DataAnnotations;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.Social
{
    public class Post : ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public User User { get; set; } = null!;
        public ICollection<PostLike> Likes { get; set; } = new HashSet<PostLike>();
        public ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
    }
}
