using MidSpace.Data.Models;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.HospitalRepo
{
    public interface IHospitalRepo : IGenericRepo<Hospital>
    {
        Task<Hospital?> GetByUserIdAsync(int userId);
    }
}
