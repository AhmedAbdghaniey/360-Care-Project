using MidSpace.Domain.Dtos.JobApplicationDtos;
namespace MidSpace.Domain.Managers.JobApplications
{
    public interface IJobApplicationsManager
    {
        Task AddJobApplicationAsync(AddJobApplicationDtos dto);
        Task<List<GetJobApplicationDtos>> GetAllJobApplicationsAsync();
        Task<List<object>> GetMyJobApplicationsAsync(int userId);
        Task UpdateJobApplicationAsync(int id, UpdateJobApplicationDtos dto);
        Task<bool> DeleteJobApplicationAsync(int id);
    }
}
