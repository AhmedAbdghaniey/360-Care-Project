using MidSpace.Domain.Dtos.DoctorJobRecommendationDtos;
using MidSpace.Data.Repository.DoctorJobRecommendationRepo;
using MidSpace.Data.Models;

namespace MidSpace.Domain.Managers.DoctorJobRecommendations
{
    public class DoctorJobRecommendationsManager : IDoctorJobRecommendationsManager
    {
        private readonly IDoctorJobRecommendationRepo _repo;

        public DoctorJobRecommendationsManager(IDoctorJobRecommendationRepo repo)
        {
            _repo = repo;
        }

        public async Task AddDoctorJobRecommendationAsync(AddDoctorJobRecommendationDtos dto)
        {
            var recommendation = new DoctorJobRecommendation
            {
                RecommendationMessage = dto.RecommendationMessage,
                HRDecisionNotes = dto.HRDecisionNotes,
                RecommendationStatus = dto.RecommendationStatus,
                DoctorId = dto.DoctorId,
                JobOpportunityId = dto.JobOpportunityId,
                RecommendationCreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(recommendation);
        }

        public async Task<List<GetDoctorJobRecommendationDtos>> GetAllDoctorJobRecommendationsAsync()
        {
            var recommendations = await _repo.GetAllAsync();

            return recommendations.Select(r => new GetDoctorJobRecommendationDtos
            {
                Id = r.Id,
                RecommendationMessage = r.RecommendationMessage,
                HRDecisionNotes = r.HRDecisionNotes,
                RecommendationCreatedAt = r.RecommendationCreatedAt,
                RecommendationStatus = r.RecommendationStatus,
                DoctorId = r.DoctorId,
                JobOpportunityId = r.JobOpportunityId
            }).ToList();
        }

        public async Task UpdateDoctorJobRecommendationAsync(int id, UpdateDoctorJobRecommendationDtos dto)
        {
            var recommendation = await _repo.GetByIdAsync(id);

            if (recommendation == null)
                throw new Exception("Doctor job recommendation not found");

            recommendation.RecommendationMessage = dto.RecommendationMessage;
            recommendation.HRDecisionNotes = dto.HRDecisionNotes;
            recommendation.RecommendationStatus = dto.RecommendationStatus;

            await _repo.Update(recommendation);
        }

        public async Task<bool> DeleteDoctorJobRecommendationAsync(int id)
        {
            var recommendation = await _repo.GetByIdAsync(id);

            if (recommendation == null)
                return false;

            await _repo.Delete(id);

            return true;
        }
    }
}
