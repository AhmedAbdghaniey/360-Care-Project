using System.Collections.Generic;

namespace MidSpace.Domain.Dtos.DoctorDtos
{
    public class GetDoctorDtos
    {
        public int DoctorId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public int ExperienceYears { get; set; }
        public string? Bio { get; set; }
        public decimal ConsultationFee { get; set; }
        public double DoctorScore { get; set; }
        public string? AvailabilityStatus { get; set; }
        public List<DoctorCertificateDto> Certificates { get; set; } = new();
    }
}
