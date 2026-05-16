using MidSpace.Domain.Dtos.AppointmentDtos;
namespace MidSpace.Domain.Managers.Appointments
{
    public interface IAppointmentsManager
    {
        Task AddAppointmentAsync(AddAppointmentDtos dto);
        Task<List<GetAppointmentDtos>> GetAllAppointmentsAsync();
        Task<object> GetMyAppointmentsAsync(int userId, string role);
        Task UpdateAppointmentAsync(int id, UpdateAppointmentDtos dto);
        Task<bool> DeleteAppointmentAsync(int id);
    }
}
