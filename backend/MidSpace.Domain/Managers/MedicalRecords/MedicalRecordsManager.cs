using MidSpace.Domain.Dtos.MedicalRecordDtos;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.MedicalRepo;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Domain.Managers.MedicalRecords
{
    public class MedicalRecordsManager : IMedicalRecordsManager
    {
        private readonly IMedicalRecordRepo _repo;

        public MedicalRecordsManager(IMedicalRecordRepo repo)
        {
            _repo = repo;
        }

        public async Task AddMedicalRecordAsync(AddMedicalRecordDtos dto)
        {
            var record = new MedicalRecord
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                AppointmentId = dto.AppointmentId,
                Symptoms = dto.Symptoms,
                Diagnosis = dto.Diagnosis,
                TreatmentPlan = dto.TreatmentPlan,
                VisitType = dto.VisitType,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(record);
        }

        public async Task<List<GetMedicalRecordDtos>> GetAllMedicalRecordsAsync()
        {
            var records = await _repo.GetAllAsync();

            return records.Select(r => new GetMedicalRecordDtos
            {
                Id = r.Id,
                PatientId = r.PatientId,
                DoctorId = r.DoctorId,
                AppointmentId = r.AppointmentId,
                Symptoms = r.Symptoms,
                Diagnosis = r.Diagnosis,
                TreatmentPlan = r.TreatmentPlan,
                VisitType = r.VisitType,
                CreatedAt = r.CreatedAt
            }).ToList();
        }

        public async Task UpdateMedicalRecordAsync(int id, UpdateMedicalRecordDtos dto)
        {
            var record = await _repo.GetByIdAsync(id);

            if (record == null)
                throw new Exception("Medical record not found");

            record.Symptoms = dto.Symptoms;
            record.Diagnosis = dto.Diagnosis;
            record.TreatmentPlan = dto.TreatmentPlan;
            record.VisitType = dto.VisitType;

            await _repo.Update(record);
        }

        public async Task<bool> DeleteMedicalRecordAsync(int id)
        {
            var record = await _repo.GetByIdAsync(id);

            if (record == null)
                return false;

            await _repo.Delete(id);

            return true;
        }
    }
}
