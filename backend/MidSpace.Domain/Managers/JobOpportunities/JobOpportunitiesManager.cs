using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Domain.Dtos.JobOpportunityDtos;
using MidSpace.Data.Repository.JobOpportunityRepo;
using MidSpace.Data.Models;

namespace MidSpace.Domain.Managers.JobOpportunities
{
    public class JobOpportunitiesManager : IJobOpportunitiesManager
    {
        private readonly IJobOpportunityRepo _repo;
        private readonly ApplicationDbContext _context;

        public JobOpportunitiesManager(IJobOpportunityRepo repo, ApplicationDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task AddJobOpportunityAsync(AddJobOpportunityDtos dto, int userId)
        {
            var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.UserId == userId);
            if (hospital == null)
                throw new Exception("Hospital profile not found for this user");

            var jobOpportunity = new JobOpportunity
            {
                JobTitle = dto.JobTitle,
                JobDescription = dto.JobDescription,
                JobLocation = dto.JobLocation,
                RequiredSpecialization = dto.RequiredSpecialization,
                MinimumSalary = dto.MinimumSalary,
                MaximumSalary = dto.MaximumSalary,
                ApplicationDeadline = dto.ApplicationDeadline,
                PostedDate = DateTime.UtcNow,
                JobOpportunityStatus = dto.JobOpportunityStatus,
                HospitalId = hospital.Id
            };
            await _repo.AddAsync(jobOpportunity);
        }

        public async Task<List<GetJobOpportunityDtos>> GetAllJobOpportunitiesAsync()
        {
            var opportunities = await _repo.GetAllWithHospitalAsync();
            return opportunities.Select(o => new GetJobOpportunityDtos
            {
                Id = o.Id,
                JobTitle = o.JobTitle,
                JobDescription = o.JobDescription,
                JobLocation = o.JobLocation,
                RequiredSpecialization = o.RequiredSpecialization,
                MinimumSalary = o.MinimumSalary,
                MaximumSalary = o.MaximumSalary,
                ApplicationDeadline = o.ApplicationDeadline,
                PostedDate = o.PostedDate,
                JobOpportunityStatus = o.JobOpportunityStatus,
                HospitalId = o.HospitalId,
                HospitalName = o.Hospital != null ? o.Hospital.HospitalName : null
            }).ToList();
        }

        public async Task<object?> GetJobByIdAsync(int id)
        {
            var job = await _context.jobOpportunities
                .Include(j => j.Hospital)
                .Include(j => j.JobApplications.Where(a => !a.IsDeleted))
                    .ThenInclude(a => a.Doctor).ThenInclude(d => d.User)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null) return null;

            return new
            {
                id = job.Id,
                title = job.JobTitle,
                jobTitle = job.JobTitle,
                location = job.JobLocation,
                jobLocation = job.JobLocation,
                description = job.JobDescription,
                jobDescription = job.JobDescription,
                requiredSpecialization = job.RequiredSpecialization,
                minimumSalary = job.MinimumSalary,
                maximumSalary = job.MaximumSalary,
                applicationDeadline = job.ApplicationDeadline,
                createdAt = job.PostedDate,
                postedDate = job.PostedDate,
                status = job.JobOpportunityStatus.ToString(),
                hospitalId = job.HospitalId,
                hospitalName = job.Hospital?.HospitalName,
                applications = job.JobApplications.Where(a => !a.IsDeleted).Select(a => new
                {
                    id = a.Id,
                    doctorName = a.Doctor?.User?.FullName ?? "Unknown",
                    name = a.Doctor?.User?.FullName ?? "Unknown",
                    doctorId = a.DoctorId,
                    status = a.JobApplicationStatus.ToString(),
                    appliedAt = a.ApplicationSubmittedAt,
                    createdAt = a.ApplicationSubmittedAt,
                    cv = a.CVFileUrl,
                    coverLetter = a.CoverLetterText
                }).ToList()
            };
        }

        public async Task<List<object>> GetMyJobsAsync()
        {
            var jobs = await _context.jobOpportunities
                .Include(j => j.Hospital)
                .Include(j => j.JobApplications.Where(a => !a.IsDeleted))
                    .ThenInclude(a => a.Doctor).ThenInclude(d => d.User)
                .ToListAsync();

            return jobs.Select(j => (object)new
            {
                id = j.Id,
                title = j.JobTitle,
                jobTitle = j.JobTitle,
                location = j.JobLocation,
                jobLocation = j.JobLocation,
                description = j.JobDescription,
                jobDescription = j.JobDescription,
                requiredSpecialization = j.RequiredSpecialization,
                minimumSalary = j.MinimumSalary,
                maximumSalary = j.MaximumSalary,
                applicationDeadline = j.ApplicationDeadline,
                createdAt = j.PostedDate,
                postedDate = j.PostedDate,
                status = j.JobOpportunityStatus.ToString(),
                applicationCount = j.JobApplications.Count(a => !a.IsDeleted),
                hospitalId = j.HospitalId,
                hospitalName = j.Hospital?.HospitalName,
                applications = j.JobApplications.Where(a => !a.IsDeleted).Select(a => new
                {
                    id = a.Id,
                    doctorName = a.Doctor?.User?.FullName ?? "Unknown",
                    name = a.Doctor?.User?.FullName ?? "Unknown",
                    doctorId = a.DoctorId,
                    status = a.JobApplicationStatus.ToString(),
                    appliedAt = a.ApplicationSubmittedAt,
                    createdAt = a.ApplicationSubmittedAt,
                    cv = a.CVFileUrl,
                    coverLetter = a.CoverLetterText
                }).ToList()
            }).ToList();
        }

        public async Task<List<object>> GetApplicationsAsync()
        {
            var apps = await _context.JobApplications
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.JobOpportunity)
                .ToListAsync();

            return apps.Select(a => (object)new
            {
                id = a.Id,
                doctorName = a.Doctor?.User?.FullName ?? "Unknown",
                jobTitle = a.JobOpportunity?.JobTitle ?? "Unknown",
                jobOpportunityId = a.JobOpportunityId,
                status = a.JobApplicationStatus.ToString(),
                appliedAt = a.ApplicationSubmittedAt ?? DateTime.UtcNow
            }).ToList();
        }

        public async Task UpdateApplicationStatusAsync(int jobId, int id, string status)
        {
            var app = await _context.JobApplications.FindAsync(id);
            if (app == null) throw new Exception("Application not found");
            if (Enum.TryParse<JobApplicationStatus>(status, out var parsedStatus))
                app.JobApplicationStatus = parsedStatus;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateJobOpportunityAsync(int id, UpdateJobOpportunityDtos dto)
        {
            var jobOpportunity = await _repo.GetByIdAsync(id);
            if (jobOpportunity == null)
                throw new Exception("Job opportunity not found");

            jobOpportunity.JobTitle = dto.JobTitle ?? jobOpportunity.JobTitle;
            jobOpportunity.JobDescription = dto.JobDescription;
            jobOpportunity.JobLocation = dto.JobLocation;
            jobOpportunity.RequiredSpecialization = dto.RequiredSpecialization;
            jobOpportunity.MinimumSalary = dto.MinimumSalary;
            jobOpportunity.MaximumSalary = dto.MaximumSalary;
            jobOpportunity.ApplicationDeadline = dto.ApplicationDeadline;
            jobOpportunity.JobOpportunityStatus = dto.JobOpportunityStatus;

            await _repo.Update(jobOpportunity);
        }

        public async Task<bool> DeleteJobOpportunityAsync(int id)
        {
            var jobOpportunity = await _repo.GetByIdAsync(id);
            if (jobOpportunity == null) return false;
            await _repo.Delete(id);
            return true;
        }
    }
}
