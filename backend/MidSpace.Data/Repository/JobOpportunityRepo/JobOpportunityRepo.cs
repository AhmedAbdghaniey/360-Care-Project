using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.JobOpportunityRepo
{
    public class JobOpportunityRepo : GenericRepo<JobOpportunity>, IJobOpportunityRepo
    {
        public JobOpportunityRepo(ApplicationDbContext context) : base(context) { }

        public async Task<List<JobOpportunity>> GetAllWithHospitalAsync()
            => await _context.jobOpportunities.Include(o => o.Hospital).ToListAsync();
    }
}
