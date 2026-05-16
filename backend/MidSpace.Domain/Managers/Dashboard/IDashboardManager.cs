namespace MidSpace.Domain.Managers.Dashboard
{
    public interface IDashboardManager
    {
        Task<object> GetDashboardAsync();
    }
}
