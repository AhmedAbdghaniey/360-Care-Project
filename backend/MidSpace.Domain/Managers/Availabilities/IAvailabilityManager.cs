using MidSpace.Domain.Dtos.AvailabilityDtos;

namespace MidSpace.Domain.Managers.Availabilities
{
    public interface IAvailabilityManager
    {
        Task<List<GetAvailabilityDtos>> GetDoctorAvailabilityAsync(int doctorId);
        Task SetDoctorAvailabilityAsync(int doctorId, List<UpsertAvailabilityDtos> slots);
    }
}
