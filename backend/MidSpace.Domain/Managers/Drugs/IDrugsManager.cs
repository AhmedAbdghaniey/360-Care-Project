using MidSpace.Domain.Dtos.DrugDtos;

namespace MidSpace.Domain.Managers.Drugs
{
    public interface IDrugsManager
    {
        Task AddDrugAsync(AddDrugDtos dto);
        Task<List<GetDrugDtos>> GetAllDrugsAsync();
        Task UpdateDrugAsync(int id, UpdateDrugDtos dto);
        Task<bool> DeleteDrugAsync(int id);
    }
}
