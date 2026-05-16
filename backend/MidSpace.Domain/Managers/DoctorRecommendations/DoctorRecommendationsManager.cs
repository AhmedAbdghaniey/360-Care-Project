using MidSpace.Domain.Dtos.DoctorRecommendationDtos;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.DoctorRecommendationRepo;

namespace MidSpace.Domain.Managers.DoctorRecommendations
{
    public class DoctorRecommendationsManager : IDoctorRecommendationsManager
    {
        private readonly IDoctorRecommendationRepo _repo;

        public DoctorRecommendationsManager(IDoctorRecommendationRepo repo)
        {
            _repo = repo;
        }

        public async Task AddDoctorRecommendationAsync(AddDoctorRecommendationDtos dto)
        {
            var recommendation = new DoctorRecommendation
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                RankOrder = dto.RankOrder,
                Reason = dto.Reason,
                RecommendationSource = dto.RecommendationSource
            };

            await _repo.AddAsync(recommendation);
        }

        public async Task<List<GetDoctorRecommendationDtos>> GetAllDoctorRecommendationsAsync()
        {
            var recommendations = await _repo.GetAllAsync();

            return recommendations.Select(r => new GetDoctorRecommendationDtos
            {
                Id = r.Id,
                PatientId = r.PatientId,
                DoctorId = r.DoctorId,
                RankOrder = r.RankOrder,
                Reason = r.Reason,
                RecommendationSource = r.RecommendationSource
            }).ToList();
        }

        public async Task UpdateDoctorRecommendationAsync(int id, UpdateDoctorRecommendationDtos dto)
        {
            var recommendation = await _repo.GetByIdAsync(id);

            if (recommendation == null)
                throw new Exception("Doctor recommendation not found");

            recommendation.RankOrder = dto.RankOrder;
            recommendation.Reason = dto.Reason;
            recommendation.RecommendationSource = dto.RecommendationSource;

            await _repo.Update(recommendation);
        }

        public async Task<bool> DeleteDoctorRecommendationAsync(int id)
        {
            var recommendation = await _repo.GetByIdAsync(id);

            if (recommendation == null)
                return false;

            await _repo.Delete(id);

            return true;
        }
    }
}
