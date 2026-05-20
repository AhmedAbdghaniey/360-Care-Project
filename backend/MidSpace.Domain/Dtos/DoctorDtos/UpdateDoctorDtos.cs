using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.DoctorDtos
{
    public class UpdateDoctorDtos
    {
        [Required, StringLength(100)]
        public string Specialization { get; set; } = string.Empty;

        [Required, StringLength(50)]
        public string LicenseNumber { get; set; } = string.Empty;

        [Range(0, 70)]
        public int ExperienceYears { get; set; }

        [StringLength(500)]
        public string? Bio { get; set; }

        [Range(0, 100000)]
        public decimal ConsultationFee { get; set; }

        public string? AvailabilityStatus { get; set; }
    }
}
