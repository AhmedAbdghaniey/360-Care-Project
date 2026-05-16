using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;

namespace MidSpace.Domain.Managers.Dashboard
{
    public class DashboardManager : IDashboardManager
    {
        private readonly ApplicationDbContext _context;

        public DashboardManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetDashboardAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalDoctors = await _context.Doctors.CountAsync();
            var totalPatients = await _context.Patients.CountAsync();
            var totalHospitals = await _context.Hospitals.CountAsync();
            var totalJobs = await _context.jobOpportunities.CountAsync();
            var totalAppointments = await _context.Appointments.CountAsync();

            var stats = new List<object>
            {
                new { title = "Total users", value = totalUsers.ToString(), trend = "+12%", trendUp = true },
                new { title = "Doctors", value = totalDoctors.ToString(), trend = "+8%", trendUp = true },
                new { title = "Patients", value = totalPatients.ToString(), trend = "+15%", trendUp = true },
                new { title = "Hospitals", value = totalHospitals.ToString(), trend = "+5%", trendUp = true },
                new { title = "Open jobs", value = totalJobs.ToString(), trend = "", trendUp = false },
                new { title = "Appointments", value = totalAppointments.ToString(), trend = "", trendUp = false }
            };

            var recentActivity = new List<object>
            {
                new { text = "New doctor registered", time = "2 hours ago", color = "bg-primary" },
                new { text = "Job posted at Cairo Hospital", time = "5 hours ago", color = "bg-blue-500" },
                new { text = "Appointment booked", time = "1 day ago", color = "bg-emerald-500" }
            };

            return new { stats, recentActivity };
        }
    }
}
