using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.user;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.DoctorsRepo
{
    public class DoctorsRepo : GenericRepo<Doctor>, IDoctorsRepo
    {
        public DoctorsRepo(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<Doctor>> GetAllAsync()
            => await _context.Doctors.Include(d => d.User).ToListAsync();

        public override async Task<Doctor?> GetByIdAsync(int id)
            => await _context.Doctors.Include(d => d.User).Include(d => d.Certificates).FirstOrDefaultAsync(d => d.Id == id);

        public async Task<Doctor?> GetByUserIdAsync(int userId)
            => await _context.Doctors.Include(d => d.User).Include(d => d.Certificates).FirstOrDefaultAsync(d => d.UserId == userId);
    }
}
