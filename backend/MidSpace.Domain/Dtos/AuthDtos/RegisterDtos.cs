using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.AuthDtos
{
    public class RegisterDtos
    {
        [Required, StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required, StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        [Required, RegularExpression("^(doctor|patient|hospital|admin)$", ErrorMessage = "Role must be doctor, patient, hospital, or admin")]
        public string Role { get; set; } = string.Empty;
    }
}
