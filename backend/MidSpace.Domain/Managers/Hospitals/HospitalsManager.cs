using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Domain.Dtos.HospitalDtos;
using MidSpace.Data.Repository.HospitalRepo;

namespace MidSpace.Domain.Managers.Hospitals
{
    public class HospitalsManager : IHospitalsManager
    {
        private readonly IHospitalRepo _repo;
        private readonly ApplicationDbContext _context;

        public HospitalsManager(IHospitalRepo repo, ApplicationDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task AddHospitalAsync(AddHospitalDtos dto, int userId)
        {
            var hospital = new Data.Models.Hospital
            {
                UserId = userId,
                HospitalName = dto.HospitalName,
                HospitalAddress = dto.HospitalAddress,
                ContactPhoneNumber = dto.ContactPhoneNumber,
                ContactEmail = dto.ContactEmail,
                OfficialWebsiteUrl = dto.OfficialWebsiteUrl,
                HospitalDescription = dto.HospitalDescription
            };

            await _repo.AddAsync(hospital);
        }

        private static List<JobSummaryDto> MapJobs(ICollection<Data.Models.JobOpportunity>? jobs)
        {
            if (jobs == null) return new();
            return jobs.Where(j => j.JobOpportunityStatus == Data.Models.JobOpportunityStatus.Open)
                .Select(j => new JobSummaryDto
                {
                    Id = j.Id,
                    JobTitle = j.JobTitle,
                    JobLocation = j.JobLocation,
                    RequiredSpecialization = j.RequiredSpecialization,
                    MinimumSalary = j.MinimumSalary,
                    MaximumSalary = j.MaximumSalary,
                    Status = j.JobOpportunityStatus.ToString()
                }).ToList();
        }

        public async Task<List<GetHospitalDtos>> GetAllHospitalsAsync()
        {
            var hospitals = await _context.Hospitals
                .Include(h => h.JobOpportunitys)
                .ToListAsync();

            return hospitals.Select(h => new GetHospitalDtos
            {
                Id = h.Id,
                HospitalName = h.HospitalName,
                HospitalAddress = h.HospitalAddress,
                ContactPhoneNumber = h.ContactPhoneNumber,
                ContactEmail = h.ContactEmail,
                OfficialWebsiteUrl = h.OfficialWebsiteUrl,
                HospitalDescription = h.HospitalDescription,
                Jobs = MapJobs(h.JobOpportunitys)
            }).ToList();
        }

        public async Task<GetHospitalDtos?> GetHospitalByIdAsync(int id)
        {
            var hospital = await _context.Hospitals
                .Include(h => h.JobOpportunitys)
                .FirstOrDefaultAsync(h => h.Id == id);
            if (hospital == null) return null;

            return new GetHospitalDtos
            {
                Id = hospital.Id,
                HospitalName = hospital.HospitalName,
                HospitalAddress = hospital.HospitalAddress,
                ContactPhoneNumber = hospital.ContactPhoneNumber,
                ContactEmail = hospital.ContactEmail,
                OfficialWebsiteUrl = hospital.OfficialWebsiteUrl,
                HospitalDescription = hospital.HospitalDescription,
                Jobs = MapJobs(hospital.JobOpportunitys)
            };
        }

        public async Task<GetHospitalDtos?> GetHospitalByUserIdAsync(int userId)
        {
            var hospital = await _context.Hospitals
                .Include(h => h.JobOpportunitys)
                .FirstOrDefaultAsync(h => h.UserId == userId);
            if (hospital == null) return null;

            return new GetHospitalDtos
            {
                Id = hospital.Id,
                HospitalName = hospital.HospitalName,
                HospitalAddress = hospital.HospitalAddress,
                ContactPhoneNumber = hospital.ContactPhoneNumber,
                ContactEmail = hospital.ContactEmail,
                OfficialWebsiteUrl = hospital.OfficialWebsiteUrl,
                HospitalDescription = hospital.HospitalDescription,
                Jobs = MapJobs(hospital.JobOpportunitys)
            };
        }

        public async Task UpdateHospitalAsync(int id, UpdateHospitalDtos dto)
        {
            var hospital = await _repo.GetByIdAsync(id);

            if (hospital == null)
                throw new Exception("Hospital not found");

            hospital.HospitalName = dto.HospitalName;
            hospital.HospitalAddress = dto.HospitalAddress;
            hospital.ContactPhoneNumber = dto.ContactPhoneNumber;
            hospital.ContactEmail = dto.ContactEmail;
            hospital.OfficialWebsiteUrl = dto.OfficialWebsiteUrl;
            hospital.HospitalDescription = dto.HospitalDescription;

            await _repo.Update(hospital);
        }

        public async Task UpdateHospitalByUserIdAsync(int userId, UpdateHospitalDtos dto)
        {
            var hospital = await _repo.GetByUserIdAsync(userId);
            if (hospital == null)
                throw new Exception("Hospital not found for this user");

            hospital.HospitalName = dto.HospitalName;
            hospital.HospitalAddress = dto.HospitalAddress;
            hospital.ContactPhoneNumber = dto.ContactPhoneNumber;
            hospital.ContactEmail = dto.ContactEmail;
            hospital.OfficialWebsiteUrl = dto.OfficialWebsiteUrl;
            hospital.HospitalDescription = dto.HospitalDescription;

            await _repo.Update(hospital);
        }

        public async Task<bool> DeleteHospitalAsync(int id)
        {
            var hospital = await _repo.GetByIdAsync(id);

            if (hospital == null)
                return false;

            await _repo.Delete(id);

            return true;
        }
    }
}
