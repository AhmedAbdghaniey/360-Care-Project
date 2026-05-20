using MidSpace.Domain.Dtos.DoctorDtos;
using MidSpace.Data.Models.user;
using MidSpace.Data.Repository.DoctorsRepo;

namespace MidSpace.Domain.Managers.Doctors
{
    public class DoctorsManager : IDoctorsManager
    {
        private readonly IDoctorsRepo _repo;

        public DoctorsManager(IDoctorsRepo repo)
        {
            _repo = repo;
        }

        public async Task AddDoctorAsync(AddDoctorDtos dto)
        {
            var doctor = new Doctor
            {
                UserId = dto.UserId,
                Specialization = dto.Specialization,
                LicenseNumber = dto.LicenseNumber,
                ExperienceYears = dto.ExperienceYears,
                Bio = dto.Bio,
                ConsultationFee = dto.ConsultationFee
            };

            doctor.AvailabilityStatus = "Available";

            await _repo.AddAsync(doctor);
        }

        public async Task UpdateDoctorAsync(int id, UpdateDoctorDtos dto)
        {
            var doctor = await _repo.GetByIdAsync(id);
            if (doctor == null)
                throw new Exception("Doctor not found");

            doctor.Specialization = dto.Specialization;
            doctor.LicenseNumber = dto.LicenseNumber;
            doctor.ExperienceYears = dto.ExperienceYears;
            doctor.Bio = dto.Bio;
            doctor.ConsultationFee = dto.ConsultationFee;
            doctor.AvailabilityStatus = dto.AvailabilityStatus ?? doctor.AvailabilityStatus;

            await _repo.Update(doctor);
        }

        public async Task<List<GetDoctorDtos>> GetAllDoctorsAsync()
        {
            var doctors = await _repo.GetAllAsync();
            return doctors.Select(d => ToDto(d)).ToList();
        }

        public async Task<GetDoctorDtos?> GetDoctorByIdAsync(int id)
        {
            var doctor = await _repo.GetByIdAsync(id);
            return doctor == null ? null : ToDto(doctor);
        }

        public async Task<GetDoctorDtos?> GetMyProfileAsync(int userId)
        {
            var doctor = await _repo.GetByUserIdAsync(userId);
            return doctor == null ? null : ToDto(doctor);
        }

        public async Task UpdateMyProfileAsync(int userId, UpdateDoctorDtos dto)
        {
            var doctor = await _repo.GetByUserIdAsync(userId);
            if (doctor == null)
                throw new Exception("Doctor profile not found");

            doctor.Specialization = dto.Specialization;
            doctor.LicenseNumber = dto.LicenseNumber;
            doctor.ExperienceYears = dto.ExperienceYears;
            doctor.Bio = dto.Bio;
            doctor.ConsultationFee = dto.ConsultationFee;
            doctor.AvailabilityStatus = dto.AvailabilityStatus ?? doctor.AvailabilityStatus;

            await _repo.Update(doctor);
        }

        public async Task<bool> DeleteDoctorAsync(int id)
        {
            var doctor = await _repo.GetByIdAsync(id);
            if (doctor == null) return false;
            await _repo.Delete(id);
            return true;
        }

        private static GetDoctorDtos ToDto(Doctor d) => new()
        {
            DoctorId = d.Id,
            UserId = d.UserId,
            FullName = d.User?.FullName ?? "",
            Email = d.User?.Email ?? "",
            Specialization = d.Specialization,
            LicenseNumber = d.LicenseNumber,
            ExperienceYears = d.ExperienceYears,
            Bio = d.Bio,
            ConsultationFee = d.ConsultationFee,
            DoctorScore = d.DoctorScore,
            AvailabilityStatus = d.AvailabilityStatus,
            Certificates = d.Certificates?.Select(c => new DoctorCertificateDto
            {
                CertificateName = c.CertificateName,
                IssuingOrganization = c.IssuingOrganization,
                IssueDate = c.IssueDate
            }).ToList() ?? new(),
            Availabilities = d.Availabilities?.Where(a => !a.IsDeleted).Select(a => new DoctorAvailabilityDto
            {
                Id = a.Id,
                DayOfWeek = a.DayOfWeek.ToString(),
                StartTime = a.StartTime.ToString(@"hh\:mm"),
                EndTime = a.EndTime.ToString(@"hh\:mm"),
                IsAvailable = a.IsAvailable
            }).ToList() ?? new()
        };
    }
}
