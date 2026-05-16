using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.user;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.PatientRepo
{
    public class PatientRepo : GenericRepo<Patient>, IPatientRepo
    {
        public PatientRepo(ApplicationDbContext context) : base(context) { }

        public override async Task<Patient?> GetByIdAsync(int id)
            => await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Allergies)
                .Include(p => p.Diseases)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        public async Task<Patient?> GetByUserIdAsync(int userId)
            => await _context.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.UserId == userId);
    }
}
