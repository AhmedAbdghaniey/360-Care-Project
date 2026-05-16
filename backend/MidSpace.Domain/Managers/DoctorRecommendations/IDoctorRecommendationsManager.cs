using MidSpace.Domain.Dtos.DoctorRecommendationDtos;

namespace MidSpace.Domain.Managers.DoctorRecommendations
{
    public interface IDoctorRecommendationsManager
    {
        Task AddDoctorRecommendationAsync(AddDoctorRecommendationDtos dto);
        Task<List<GetDoctorRecommendationDtos>> GetAllDoctorRecommendationsAsync();
        Task UpdateDoctorRecommendationAsync(int id, UpdateDoctorRecommendationDtos dto);
        Task<bool> DeleteDoctorRecommendationAsync(int id);
    }
}
