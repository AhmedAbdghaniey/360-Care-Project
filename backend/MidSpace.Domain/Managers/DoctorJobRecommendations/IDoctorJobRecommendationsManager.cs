using MidSpace.Domain.Dtos.DoctorJobRecommendationDtos;

namespace MidSpace.Domain.Managers.DoctorJobRecommendations
{
    public interface IDoctorJobRecommendationsManager
    {
        Task AddDoctorJobRecommendationAsync(AddDoctorJobRecommendationDtos dto);
        Task<List<GetDoctorJobRecommendationDtos>> GetAllDoctorJobRecommendationsAsync();
        Task UpdateDoctorJobRecommendationAsync(int id, UpdateDoctorJobRecommendationDtos dto);
        Task<bool> DeleteDoctorJobRecommendationAsync(int id);
    }
}
