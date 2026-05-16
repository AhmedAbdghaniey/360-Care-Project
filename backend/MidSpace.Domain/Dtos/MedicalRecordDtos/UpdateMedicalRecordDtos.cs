using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.MedicalRecordDtos
{
    public class UpdateMedicalRecordDtos
    {
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
