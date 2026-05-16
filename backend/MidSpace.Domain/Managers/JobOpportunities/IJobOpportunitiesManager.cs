using MidSpace.Domain.Dtos.JobOpportunityDtos;
namespace MidSpace.Domain.Managers.JobOpportunities
{
    public interface IJobOpportunitiesManager
    {
        Task AddJobOpportunityAsync(AddJobOpportunityDtos dto, int userId);
        Task<List<GetJobOpportunityDtos>> GetAllJobOpportunitiesAsync();
        Task<object?> GetJobByIdAsync(int id);
        Task<List<object>> GetMyJobsAsync();
        Task<List<object>> GetApplicationsAsync();
        Task UpdateApplicationStatusAsync(int jobId, int id, string status);
        Task UpdateJobOpportunityAsync(int id, UpdateJobOpportunityDtos dto);
        Task<bool> DeleteJobOpportunityAsync(int id);
    }
}
