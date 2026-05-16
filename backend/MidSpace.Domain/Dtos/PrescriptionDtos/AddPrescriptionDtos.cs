using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.PrescriptionDtos
{
    public class AddPrescriptionDtos
    {
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public int? MedicalRecordId { get; set; }
        public DateTime? Date { get; set; }
    }
}
