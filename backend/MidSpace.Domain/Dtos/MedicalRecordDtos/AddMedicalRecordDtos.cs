using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.MedicalRecordDtos
{
    public class AddMedicalRecordDtos
    {
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public int? AppointmentId { get; set; }

        [StringLength(2000)]
        public string? Symptoms { get; set; }

        [StringLength(2000)]
        public string? Diagnosis { get; set; }

        [StringLength(2000)]
        public string? TreatmentPlan { get; set; }

        [StringLength(50)]
        public string? VisitType { get; set; }
    }
}
