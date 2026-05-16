using MidSpace.Data.Models;

namespace MidSpace.Domain.Dtos.JobOpportunityDtos
{
    public class GetJobOpportunityDtos
    {
        public int Id { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string? JobDescription { get; set; }
        public string? JobLocation { get; set; }
        public string? RequiredSpecialization { get; set; }
        public decimal? MinimumSalary { get; set; }
        public decimal? MaximumSalary { get; set; }
        public DateTime? ApplicationDeadline { get; set; }
        public DateTime? PostedDate { get; set; }
        public JobOpportunityStatus JobOpportunityStatus { get; set; }
        public int? HospitalId { get; set; }
        public string? HospitalName { get; set; }

        public string? Title => JobTitle;
        public string? Location => JobLocation;
        public DateTime? CreatedAt => PostedDate;
        public string Status => JobOpportunityStatus.ToString();
    }
}
