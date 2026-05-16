using MidSpace.Data.Models;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.JobOpportunityRepo
{
    public interface IJobOpportunityRepo : IGenericRepo<JobOpportunity>
    {
        Task<List<JobOpportunity>> GetAllWithHospitalAsync();
    }
}
