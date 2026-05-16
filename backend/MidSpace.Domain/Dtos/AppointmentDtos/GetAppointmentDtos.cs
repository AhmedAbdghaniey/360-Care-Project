namespace MidSpace.Domain.Dtos.AppointmentDtos
{
    public class GetAppointmentDtos
    {
        public int Id { get; set; }
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
        public decimal? ConsultationFeeAtBooking { get; set; }
        public string? CancellationReason { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
