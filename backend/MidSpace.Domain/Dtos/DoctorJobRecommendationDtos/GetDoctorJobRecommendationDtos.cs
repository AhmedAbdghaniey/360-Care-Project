using MidSpace.Data.Models;

namespace MidSpace.Domain.Dtos.DoctorJobRecommendationDtos
{
    public class GetDoctorJobRecommendationDtos
    {
        public int Id { get; set; }
        public string RecommendationMessage { get; set; } = string.Empty;
        public string? HRDecisionNotes { get; set; }
        public DateTime? RecommendationCreatedAt { get; set; }
        public RecommendationStatus RecommendationStatus { get; set; }
        public int? DoctorId { get; set; }
        public int? JobOpportunityId { get; set; }
    }
}
