namespace MidSpace.Domain.Dtos.SocialDtos
{
    public class FollowDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserProfileImage { get; set; }
        public DateTime FollowedAt { get; set; }
    }
}
