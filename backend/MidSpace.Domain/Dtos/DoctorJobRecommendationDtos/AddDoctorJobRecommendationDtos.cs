using System.ComponentModel.DataAnnotations;
using MidSpace.Data.Models;

namespace MidSpace.Domain.Dtos.DoctorJobRecommendationDtos
{
    public class AddDoctorJobRecommendationDtos
    {
        [Required, StringLength(1000)]
        public string RecommendationMessage { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? HRDecisionNotes { get; set; }
        public RecommendationStatus RecommendationStatus { get; set; }

        public int? DoctorId { get; set; }
        public int? JobOpportunityId { get; set; }
    }
}
