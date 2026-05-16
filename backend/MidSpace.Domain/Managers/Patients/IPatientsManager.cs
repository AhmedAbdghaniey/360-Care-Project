using MidSpace.Domain.Dtos.PatientDtos;
namespace MidSpace.Domain.Managers.Patients
{
    public interface IPatientsManager
    {
        Task AddPatientAsync(AddPatientDtos dto);
        Task<List<GetPatientDtos>> GetAllPatientsAsync();
        Task<GetPatientDtos?> GetPatientByIdAsync(int id);
        Task<object?> GetMyProfileAsync(int userId);
        Task UpdateMyProfileAsync(int userId, UpdatePatientDtos dto);
        Task UpdatePatientAsync(int id, UpdatePatientDtos dto);
        Task<bool> DeletePatientAsync(int id);
    }
}
