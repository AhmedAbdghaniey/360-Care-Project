namespace MidSpace.Domain.Dtos.DoctorRecommendationDtos
{
    public class GetDoctorRecommendationDtos
    {
        public int Id { get; set; }
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public int? RankOrder { get; set; }
        public string? Reason { get; set; }
        public string? RecommendationSource { get; set; }
    }
}
