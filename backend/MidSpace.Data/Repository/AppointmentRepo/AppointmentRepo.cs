using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.AppointmentRepository
{
    public class AppointmentRepo : GenericRepo<Appointment>, IAppointmentRepo
    {
        public AppointmentRepo(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorId(int doctorId)
        =>  await _context.Appointments.Where(a => a.DoctorId == doctorId).ToListAsync();

        public async Task<IEnumerable<Appointment>> GetAppointmentsByPatientId(int patientId)
        => await _context.Appointments.Where(a => a.PatientId == patientId).ToListAsync();
    }
}
