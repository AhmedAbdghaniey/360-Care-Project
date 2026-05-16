namespace MidSpace.Domain.Dtos.MedicalRecordDtos
{
    public class GetMedicalRecordDtos
    {
        public int Id { get; set; }
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public int? AppointmentId { get; set; }
        public string? Symptoms { get; set; }
        public string? Diagnosis { get; set; }
        public string? TreatmentPlan { get; set; }
        public string? VisitType { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
