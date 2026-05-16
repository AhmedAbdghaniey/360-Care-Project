using MidSpace.Data.Data;
using MidSpace.Data.Models;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.JobApplicationRepo
{
    public class JobApplicationRepo : GenericRepo<JobApplication>, IJobApplicationRepo
    {
        public JobApplicationRepo(ApplicationDbContext context) : base(context) { }
    }
}
