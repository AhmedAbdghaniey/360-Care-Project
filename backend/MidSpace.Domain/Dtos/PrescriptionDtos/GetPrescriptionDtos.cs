namespace MidSpace.Domain.Dtos.PrescriptionDtos
{
    public class GetPrescriptionDtos
    {
        public int Id { get; set; }
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public int? MedicalRecordId { get; set; }
        public DateTime? Date { get; set; }
    }
}
