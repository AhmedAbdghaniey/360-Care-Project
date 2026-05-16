using System.ComponentModel.DataAnnotations;

namespace MidSpace.Domain.Dtos.DoctorRecommendationDtos
{
    public class UpdateDoctorRecommendationDtos
    {
        [Range(1, 5)]
        public int? RankOrder { get; set; }

        [StringLength(500)]
        public string? Reason { get; set; }

        [StringLength(100)]
        public string? RecommendationSource { get; set; }
    }
}
