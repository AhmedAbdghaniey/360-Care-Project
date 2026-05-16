using MidSpace.Domain.Dtos.AuthDtos;
namespace MidSpace.Domain.Managers.Auth
{
    public interface IAuthManager
    {
        Task<object> RegisterAsync(RegisterDtos dto);
        Task<object> LoginAsync(LoginDtos dto);
        Task DeleteMyAccountAsync(int userId);
        Task ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task UpdateProfileAsync(int userId, string fullName, string? profileImage);
    }
}
