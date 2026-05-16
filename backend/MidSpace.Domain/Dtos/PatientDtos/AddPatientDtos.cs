using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.PatientDtos
{
    public class AddPatientDtos
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime DOB { get; set; }

        [Required, StringLength(10)]
        public string Gender { get; set; } = string.Empty;

        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [StringLength(5)]
        public string BloodType { get; set; } = string.Empty;

        [StringLength(20)]
        public string EmergencyContact { get; set; } = string.Empty;
    }
}
