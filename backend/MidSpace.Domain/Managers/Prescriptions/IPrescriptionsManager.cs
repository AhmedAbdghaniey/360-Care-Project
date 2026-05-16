using MidSpace.Domain.Dtos.PrescriptionDtos;

namespace MidSpace.Domain.Managers.Prescriptions
{
    public interface IPrescriptionsManager
    {
        Task AddPrescriptionAsync(AddPrescriptionDtos dto);
        Task<List<GetPrescriptionDtos>> GetAllPrescriptionsAsync();
        Task UpdatePrescriptionAsync(int id, UpdatePrescriptionDtos dto);
        Task<bool> DeletePrescriptionAsync(int id);
    }
}
