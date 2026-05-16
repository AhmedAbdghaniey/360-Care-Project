using System;

namespace MidSpace.Domain.Dtos.DoctorDtos
{
    public class DoctorCertificateDto
    {
        public string CertificateName { get; set; } = string.Empty;
        public string IssuingOrganization { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
    }
}
