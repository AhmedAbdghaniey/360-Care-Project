using MidSpace.Data.Models;

namespace MidSpace.Domain.Dtos.JobApplicationDtos
{
    public class GetJobApplicationDtos
    {
        public int Id { get; set; }
        public DateTime? ApplicationSubmittedAt { get; set; }
        public string? CVFileUrl { get; set; }
        public string? CoverLetterText { get; set; }
        public JobApplicationStatus JobApplicationStatus { get; set; }
        public int? JobOpportunityId { get; set; }
        public int? DoctorId { get; set; }
    }
}
