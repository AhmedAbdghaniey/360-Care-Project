using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.AppointmentDtos
{
    public class AddAppointmentDtos
    {
        public int? PatientId { get; set; }

        [Required]
        public int? DoctorId { get; set; }

        [Required]
        public DateTime? AppointmentDate { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [Range(0, 100000)]
        public decimal? ConsultationFeeAtBooking { get; set; }
    }
}
