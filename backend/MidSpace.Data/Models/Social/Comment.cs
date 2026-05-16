using System.ComponentModel.DataAnnotations;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.Social
{
    public class Comment : ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Post Post { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
