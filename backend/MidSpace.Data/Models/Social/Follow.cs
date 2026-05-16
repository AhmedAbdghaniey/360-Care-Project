using System.ComponentModel.DataAnnotations;

namespace MidSpace.Data.Models.Social
{
    public class Follow
    {
        [Key]
        public int Id { get; set; }
        public int FollowerId { get; set; }
        public int FolloweeId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public User Follower { get; set; } = null!;
        public User Followee { get; set; } = null!;
    }
}
