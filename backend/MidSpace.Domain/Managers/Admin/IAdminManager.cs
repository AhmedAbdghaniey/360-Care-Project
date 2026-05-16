namespace MidSpace.Domain.Managers.Admin
{
    public interface IAdminManager
    {
        Task<object> GetUsersAsync();
        Task ToggleActiveAsync(int id);
        Task DeleteUserAsync(int id);
    }
}
