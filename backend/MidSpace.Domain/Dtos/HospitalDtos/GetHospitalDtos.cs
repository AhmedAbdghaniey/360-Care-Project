using MidSpace.Domain.Dtos.JobOpportunityDtos;

namespace MidSpace.Domain.Dtos.HospitalDtos
{
    public class GetHospitalDtos
    {
        public int Id { get; set; }
        public string HospitalName { get; set; } = string.Empty;
        public string? HospitalAddress { get; set; }
        public string? ContactPhoneNumber { get; set; }
        public string? ContactEmail { get; set; }
        public string? OfficialWebsiteUrl { get; set; }
        public string? HospitalDescription { get; set; }
        public List<JobSummaryDto> Jobs { get; set; } = new();
    }

    public class JobSummaryDto
    {
        public int Id { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string? JobLocation { get; set; }
        public string? RequiredSpecialization { get; set; }
        public decimal? MinimumSalary { get; set; }
        public decimal? MaximumSalary { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
