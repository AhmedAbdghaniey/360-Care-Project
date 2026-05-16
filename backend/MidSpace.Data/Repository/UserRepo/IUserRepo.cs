using MidSpace.Data.Models;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.UserRepo
{
    public interface IUserRepo : IGenericRepo<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
