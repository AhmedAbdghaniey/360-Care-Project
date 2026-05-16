using MidSpace.Domain.Dtos.DrugDtos;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.DrugRepo;

namespace MidSpace.Domain.Managers.Drugs
{
    public class DrugsManager : IDrugsManager
    {
        private readonly IDrugRepo _repo;

        public DrugsManager(IDrugRepo repo)
        {
            _repo = repo;
        }

        public async Task AddDrugAsync(AddDrugDtos dto)
        {
            var drug = new Drug
            {
                DrugName = dto.DrugName
            };

            await _repo.AddAsync(drug);
        }

        public async Task<List<GetDrugDtos>> GetAllDrugsAsync()
        {
            var drugs = await _repo.GetAllAsync();

            return drugs.Select(d => new GetDrugDtos
            {
                Id = d.Id,
                DrugName = d.DrugName
            }).ToList();
        }

        public async Task UpdateDrugAsync(int id, UpdateDrugDtos dto)
        {
            var drug = await _repo.GetByIdAsync(id);

            if (drug == null)
                throw new Exception("Drug not found");

            drug.DrugName = dto.DrugName;

            await _repo.Update(drug);
        }

        public async Task<bool> DeleteDrugAsync(int id)
        {
            var drug = await _repo.GetByIdAsync(id);

            if (drug == null)
                return false;

            await _repo.Delete(id);

            return true;
        }
    }
}
