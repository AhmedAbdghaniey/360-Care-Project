using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.AppointmentRepository
{
    public interface IAppointmentRepo : IGenericRepo<Appointment>
    {
        Task<IEnumerable<Appointment>> GetAppointmentsByDoctorId(int doctorId);
        Task<IEnumerable<Appointment>> GetAppointmentsByPatientId(int patientId);
    }
}
