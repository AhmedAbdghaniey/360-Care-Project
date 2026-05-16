using MidSpace.Data.Models.user;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.DoctorsRepo
{
    public interface IDoctorsRepo : IGenericRepo<Doctor>
    {
        Task<Doctor?> GetByUserIdAsync(int userId);
    }
}
