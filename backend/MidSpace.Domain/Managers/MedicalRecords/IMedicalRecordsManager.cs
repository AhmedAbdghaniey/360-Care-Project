using MidSpace.Domain.Dtos.MedicalRecordDtos;

namespace MidSpace.Domain.Managers.MedicalRecords
{
    public interface IMedicalRecordsManager
    {
        Task AddMedicalRecordAsync(AddMedicalRecordDtos dto);
        Task<List<GetMedicalRecordDtos>> GetAllMedicalRecordsAsync();
        Task UpdateMedicalRecordAsync(int id, UpdateMedicalRecordDtos dto);
        Task<bool> DeleteMedicalRecordAsync(int id);
    }
}
