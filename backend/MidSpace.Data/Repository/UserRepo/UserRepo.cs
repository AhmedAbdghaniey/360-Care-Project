using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.UserRepo
{
    public class UserRepo : GenericRepo<User>, IUserRepo
    {
        public UserRepo(ApplicationDbContext context) : base(context) { }

        public async Task<User?> GetByEmailAsync(string email)
            => await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
}
