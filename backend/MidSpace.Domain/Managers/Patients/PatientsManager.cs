using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Domain.Dtos.PatientDtos;
using MidSpace.Data.Models.user;
using MidSpace.Data.Repository.PatientRepo;

namespace MidSpace.Domain.Managers.Patients
{
    public class PatientsManager : IPatientsManager
    {
        private readonly IPatientRepo _repo;
        private readonly ApplicationDbContext _context;

        public PatientsManager(IPatientRepo repo, ApplicationDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task AddPatientAsync(AddPatientDtos dto)
        {
            var patient = new Patient
            {
                UserId = dto.UserId,
                DOB = dto.DOB,
                Gender = dto.Gender,
                Address = dto.Address,
                BloodType = dto.BloodType,
                EmergencyContact = dto.EmergencyContact
            };

            await _repo.AddAsync(patient);
        }

        public async Task<List<GetPatientDtos>> GetAllPatientsAsync()
        {
            var patients = await _repo.GetAllAsync();
            return patients.Select(p => ToDto(p)).ToList();
        }

        public async Task<GetPatientDtos?> GetPatientByIdAsync(int id)
        {
            var patient = await _repo.GetByIdAsync(id);
            return patient == null ? null : ToDto(patient);
        }

        public async Task<object?> GetMyProfileAsync(int userId)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Allergies)
                .Include(p => p.Diseases)
                .FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return null;
            return new
            {
                id = patient.Id,
                name = patient.User?.FullName ?? "",
                fullName = patient.User?.FullName ?? "",
                email = patient.User?.Email ?? "",
                dob = patient.DOB,
                gender = patient.Gender,
                address = patient.Address,
                bloodType = patient.BloodType,
                emergencyContact = patient.EmergencyContact,
                allergies = patient.Allergies.Select(a => a.AllergyName).ToList(),
                chronicDiseases = patient.Diseases.Select(d => d.DiseaseName).ToList()
            };
        }

        public async Task UpdateMyProfileAsync(int userId, UpdatePatientDtos dto)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null)
                throw new Exception("Patient profile not found");

            patient.DOB = dto.DOB;
            patient.Gender = dto.Gender;
            patient.Address = dto.Address;
            patient.BloodType = dto.BloodType;
            patient.EmergencyContact = dto.EmergencyContact;
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePatientAsync(int id, UpdatePatientDtos dto)
        {
            var patient = await _repo.GetByIdAsync(id);
            if (patient == null)
                throw new Exception("Patient not found");

            patient.DOB = dto.DOB;
            patient.Gender = dto.Gender;
            patient.Address = dto.Address;
            patient.BloodType = dto.BloodType;
            patient.EmergencyContact = dto.EmergencyContact;
            await _repo.Update(patient);
        }

        public async Task<bool> DeletePatientAsync(int id)
        {
            var patient = await _repo.GetByIdAsync(id);
            if (patient == null) return false;
            await _repo.Delete(id);
            return true;
        }

        private static GetPatientDtos ToDto(Patient p) => new()
        {
            Id = p.Id,
            UserId = p.UserId,
            Name = p.User?.FullName ?? "",
            DOB = p.DOB,
            Gender = p.Gender,
            Address = p.Address,
            BloodType = p.BloodType,
            EmergencyContact = p.EmergencyContact,
            Allergies = p.Allergies?.Where(a => !a.IsDeleted).Select(a => a.AllergyName).ToList() ?? new(),
            ChronicDiseases = p.Diseases?.Where(d => !d.IsDeleted).Select(d => d.DiseaseName).ToList() ?? new()
        };
    }
}
