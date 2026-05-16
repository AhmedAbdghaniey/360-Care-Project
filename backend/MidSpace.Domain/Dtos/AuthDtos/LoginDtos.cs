using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.AuthDtos
{
    public class LoginDtos
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
