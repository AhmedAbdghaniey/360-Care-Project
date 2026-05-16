using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.AuthDtos
{
    public class UpdateProfileDto
    {
        [Required, StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        public string? ProfileImage { get; set; }
    }
}
