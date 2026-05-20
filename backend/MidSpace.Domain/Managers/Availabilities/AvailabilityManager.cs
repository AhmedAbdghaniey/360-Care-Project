using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Domain.Dtos.AvailabilityDtos;
using MidSpace.Data.Models.user;

namespace MidSpace.Domain.Managers.Availabilities
{
    public class AvailabilityManager : IAvailabilityManager
    {
        private readonly ApplicationDbContext _context;

        public AvailabilityManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<GetAvailabilityDtos>> GetDoctorAvailabilityAsync(int doctorId)
        {
            return await _context.DoctorAvailabilities
                .Where(a => a.DoctorID == doctorId && !a.IsDeleted)
                .OrderBy(a => a.DayOfWeek)
                .ThenBy(a => a.StartTime)
                .Select(a => new GetAvailabilityDtos
                {
                    Id = a.Id,
                    DayOfWeek = a.DayOfWeek.ToString(),
                    StartTime = a.StartTime.ToString(@"hh\:mm"),
                    EndTime = a.EndTime.ToString(@"hh\:mm"),
                    IsAvailable = a.IsAvailable
                })
                .ToListAsync();
        }

        public async Task SetDoctorAvailabilityAsync(int doctorId, List<UpsertAvailabilityDtos> slots)
        {
            var existing = await _context.DoctorAvailabilities
                .Where(a => a.DoctorID == doctorId && !a.IsDeleted)
                .ToListAsync();

            _context.DoctorAvailabilities.RemoveRange(existing);

            foreach (var slot in slots)
            {
                if (!Enum.TryParse<DayOfWeek>(slot.DayOfWeek, out var day)) continue;
                if (!TimeSpan.TryParse(slot.StartTime, out var start)) continue;
                if (!TimeSpan.TryParse(slot.EndTime, out var end)) continue;

                _context.DoctorAvailabilities.Add(new DoctorAvailability
                {
                    DoctorID = doctorId,
                    DayOfWeek = day,
                    StartTime = start,
                    EndTime = end,
                    IsAvailable = slot.IsAvailable
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
