using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.HospitalRepo
{
    public class HospitalRepo : GenericRepo<Hospital>, IHospitalRepo
    {
        public HospitalRepo(ApplicationDbContext context) : base(context) { }

        public async Task<Hospital?> GetByUserIdAsync(int userId)
            => await _context.Hospitals.FirstOrDefaultAsync(h => h.UserId == userId);
    }
}
