using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.AppointmentDtos
{
    public class UpdateAppointmentDtos
    {
        public DateTime? AppointmentDate { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [Range(0, 100000)]
        public decimal? ConsultationFeeAtBooking { get; set; }

        [StringLength(500)]
        public string? CancellationReason { get; set; }
    }
}
