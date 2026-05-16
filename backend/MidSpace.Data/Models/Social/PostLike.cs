using System.ComponentModel.DataAnnotations;

namespace MidSpace.Data.Models.Social
{
    public class PostLike
    {
        [Key]
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Post Post { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
