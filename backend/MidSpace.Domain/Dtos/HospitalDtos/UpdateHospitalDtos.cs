using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.HospitalDtos
{
    public class UpdateHospitalDtos
    {
        [Required, StringLength(200)]
        public string HospitalName { get; set; } = string.Empty;

        [StringLength(300)]
        public string? HospitalAddress { get; set; }

        [Phone, StringLength(20)]
        public string? ContactPhoneNumber { get; set; }

        [EmailAddress, StringLength(150)]
        public string? ContactEmail { get; set; }

        [Url, StringLength(500)]
        public string? OfficialWebsiteUrl { get; set; }

        [StringLength(1000)]
        public string? HospitalDescription { get; set; }
    }
}
