using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Domain.Dtos.JobApplicationDtos;
using MidSpace.Data.Repository.JobApplicationRepo;
using MidSpace.Data.Models;

namespace MidSpace.Domain.Managers.JobApplications
{
    public class JobApplicationsManager : IJobApplicationsManager
    {
        private readonly IJobApplicationRepo _repo;
        private readonly ApplicationDbContext _context;

        public JobApplicationsManager(IJobApplicationRepo repo, ApplicationDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task AddJobApplicationAsync(AddJobApplicationDtos dto)
        {
            var jobApplication = new JobApplication
            {
                CVFileUrl = dto.CVFileUrl,
                CoverLetterText = dto.CoverLetterText,
                JobApplicationStatus = dto.JobApplicationStatus,
                JobOpportunityId = dto.JobOpportunityId,
                DoctorId = dto.DoctorId,
                ApplicationSubmittedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(jobApplication);
        }

        public async Task<List<GetJobApplicationDtos>> GetAllJobApplicationsAsync()
        {
            var applications = await _repo.GetAllAsync();
            return applications.Select(a => new GetJobApplicationDtos
            {
                Id = a.Id,
                ApplicationSubmittedAt = a.ApplicationSubmittedAt,
                CVFileUrl = a.CVFileUrl,
                CoverLetterText = a.CoverLetterText,
                JobApplicationStatus = a.JobApplicationStatus,
                JobOpportunityId = a.JobOpportunityId,
                DoctorId = a.DoctorId
            }).ToList();
        }

        public async Task<List<object>> GetMyJobApplicationsAsync(int userId)
        {
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctor == null) throw new Exception("Doctor profile not found");

            var apps = await _context.JobApplications
                .Include(a => a.JobOpportunity)
                    .ThenInclude(j => j.Hospital)
                .Where(a => a.DoctorId == doctor.Id)
                .ToListAsync();

            return apps.Select(a => (object)new
            {
                id = a.Id,
                jobTitle = a.JobOpportunity?.JobTitle ?? "Unknown",
                jobOpportunityId = a.JobOpportunityId,
                hospitalName = a.JobOpportunity?.Hospital?.HospitalName,
                status = a.JobApplicationStatus.ToString(),
                appliedAt = a.ApplicationSubmittedAt ?? DateTime.UtcNow
            }).ToList();
        }

        public async Task UpdateJobApplicationAsync(int id, UpdateJobApplicationDtos dto)
        {
            var jobApplication = await _repo.GetByIdAsync(id);
            if (jobApplication == null)
                throw new Exception("Job application not found");

            jobApplication.CVFileUrl = dto.CVFileUrl;
            jobApplication.CoverLetterText = dto.CoverLetterText;
            jobApplication.JobApplicationStatus = dto.JobApplicationStatus;
            await _repo.Update(jobApplication);
        }

        public async Task<bool> DeleteJobApplicationAsync(int id)
        {
            var jobApplication = await _repo.GetByIdAsync(id);
            if (jobApplication == null) return false;
            await _repo.Delete(id);
            return true;
        }
    }
}
