using System.ComponentModel.DataAnnotations;
using MidSpace.Data.Models;

namespace MidSpace.Domain.Dtos.JobOpportunityDtos
{
    public class AddJobOpportunityDtos
    {
        [Required, StringLength(200)]
        public string JobTitle { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? JobDescription { get; set; }

        [StringLength(200)]
        public string? JobLocation { get; set; }

        [StringLength(100)]
        public string? RequiredSpecialization { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? MinimumSalary { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? MaximumSalary { get; set; }

        public DateTime? ApplicationDeadline { get; set; }
        public JobOpportunityStatus JobOpportunityStatus { get; set; } = JobOpportunityStatus.Open;

        public int? HospitalId { get; set; }
    }
}
