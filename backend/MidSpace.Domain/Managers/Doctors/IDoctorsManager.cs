using MidSpace.Domain.Dtos.DoctorDtos;
namespace MidSpace.Domain.Managers.Doctors
{
    public interface IDoctorsManager
    {
        Task AddDoctorAsync(AddDoctorDtos dto);
        Task<List<GetDoctorDtos>> GetAllDoctorsAsync();
        Task<GetDoctorDtos?> GetDoctorByIdAsync(int id);
        Task<GetDoctorDtos?> GetMyProfileAsync(int userId);
        Task UpdateMyProfileAsync(int userId, UpdateDoctorDtos dto);
        Task UpdateDoctorAsync(int id, UpdateDoctorDtos dto);
        Task<bool> DeleteDoctorAsync(int id);
    }
}
