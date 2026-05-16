using MidSpace.Domain.Dtos.PrescriptionDtos;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.PrescriptionRepo;

namespace MidSpace.Domain.Managers.Prescriptions
{
    public class PrescriptionsManager : IPrescriptionsManager
    {
        private readonly IPrescriptionRepo _repo;

        public PrescriptionsManager(IPrescriptionRepo repo)
        {
            _repo = repo;
        }

        public async Task AddPrescriptionAsync(AddPrescriptionDtos dto)
        {
            var prescription = new Prescription
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                MedicalRecordId = dto.MedicalRecordId,
                Date = dto.Date
            };

            await _repo.AddAsync(prescription);
        }

        public async Task<List<GetPrescriptionDtos>> GetAllPrescriptionsAsync()
        {
            var prescriptions = await _repo.GetAllAsync();

            return prescriptions.Select(p => new GetPrescriptionDtos
            {
                Id = p.Id,
                PatientId = p.PatientId,
                DoctorId = p.DoctorId,
                MedicalRecordId = p.MedicalRecordId,
                Date = p.Date
            }).ToList();
        }

        public async Task UpdatePrescriptionAsync(int id, UpdatePrescriptionDtos dto)
        {
            var prescription = await _repo.GetByIdAsync(id);

            if (prescription == null)
                throw new Exception("Prescription not found");

            prescription.Date = dto.Date;

            await _repo.Update(prescription);
        }

        public async Task<bool> DeletePrescriptionAsync(int id)
        {
            var prescription = await _repo.GetByIdAsync(id);

            if (prescription == null)
                return false;

            await _repo.Delete(id);

            return true;
        }
    }
}
