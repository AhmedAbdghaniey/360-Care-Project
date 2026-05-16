using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Domain.Dtos.AppointmentDtos;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.AppointmentRepository;

namespace MidSpace.Domain.Managers.Appointments
{
    public class AppointmentsManager : IAppointmentsManager
    {
        private readonly IAppointmentRepo _repo;
        private readonly ApplicationDbContext _context;

        public AppointmentsManager(IAppointmentRepo repo, ApplicationDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task AddAppointmentAsync(AddAppointmentDtos dto)
        {
            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate,
                Status = dto.Status,
                Notes = dto.Notes,
                ConsultationFeeAtBooking = dto.ConsultationFeeAtBooking,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(appointment);
        }

        public async Task<List<GetAppointmentDtos>> GetAllAppointmentsAsync()
        {
            var appointments = await _repo.GetAllAsync();
            return appointments.Select(a => new GetAppointmentDtos
            {
                Id = a.Id,
                PatientId = a.PatientId,
                DoctorId = a.DoctorId,
                AppointmentDate = a.AppointmentDate,
                Status = a.Status,
                Notes = a.Notes,
                ConsultationFeeAtBooking = a.ConsultationFeeAtBooking,
                CancellationReason = a.CancellationReason,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            }).ToList();
        }

        public async Task<object> GetMyAppointmentsAsync(int userId, string role)
        {
            if (role == "patient")
            {
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient == null) throw new Exception("Patient not found");

                return await _context.Appointments
                    .Where(a => a.PatientId == patient.Id)
                    .Include(a => a.Doctor).ThenInclude(d => d.User)
                    .Select(a => new
                    {
                        id = a.Id,
                        doctorId = a.Doctor != null ? a.Doctor.UserId : (int?)null,
                        doctorName = a.Doctor != null ? a.Doctor.User.FullName : "Unknown",
                        specialization = a.Doctor != null ? a.Doctor.Specialization : "",
                        date = a.AppointmentDate,
                        status = a.Status ?? "Scheduled",
                        notes = a.Notes
                    })
                    .ToListAsync();
            }
            else if (role == "doctor")
            {
                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                if (doctor == null) throw new Exception("Doctor not found");

                return await _context.Appointments
                    .Where(a => a.DoctorId == doctor.Id)
                    .Include(a => a.Patient).ThenInclude(p => p.User)
                    .Select(a => new
                    {
                        id = a.Id,
                        patientName = a.Patient != null ? a.Patient.User.FullName : "Unknown",
                        date = a.AppointmentDate,
                        status = a.Status ?? "Scheduled",
                        notes = a.Notes
                    })
                    .ToListAsync();
            }

            throw new Exception("Invalid role");
        }

        public async Task UpdateAppointmentAsync(int id, UpdateAppointmentDtos dto)
        {
            var appointment = await _repo.GetByIdAsync(id);
            if (appointment == null)
                throw new Exception("Appointment not found");

            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.Status = dto.Status;
            appointment.Notes = dto.Notes;
            appointment.ConsultationFeeAtBooking = dto.ConsultationFeeAtBooking;
            appointment.CancellationReason = dto.CancellationReason;
            appointment.UpdatedAt = DateTime.UtcNow;

            await _repo.Update(appointment);
        }

        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            var appointment = await _repo.GetByIdAsync(id);
            if (appointment == null) return false;
            await _repo.Delete(id);
            return true;
        }
    }
}
