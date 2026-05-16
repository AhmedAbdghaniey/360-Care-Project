using MidSpace.Domain.Dtos.HospitalDtos;

namespace MidSpace.Domain.Managers.Hospitals
{
    public interface IHospitalsManager
    {
        Task AddHospitalAsync(AddHospitalDtos dto, int userId);
        Task<List<GetHospitalDtos>> GetAllHospitalsAsync();
        Task<GetHospitalDtos?> GetHospitalByUserIdAsync(int userId);
        Task<GetHospitalDtos?> GetHospitalByIdAsync(int id);
        Task UpdateHospitalAsync(int id, UpdateHospitalDtos dto);
        Task UpdateHospitalByUserIdAsync(int userId, UpdateHospitalDtos dto);
        Task<bool> DeleteHospitalAsync(int id);
    }
}
