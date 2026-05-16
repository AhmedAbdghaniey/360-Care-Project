using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;

namespace MidSpace.Domain.Managers.Admin
{
    public class AdminManager : IAdminManager
    {
        private readonly ApplicationDbContext _context;

        private static readonly Dictionary<int, string> RoleMap = new()
        {
            { 1, "doctor" },
            { 2, "patient" },
            { 3, "hospital" },
            { 4, "admin" }
        };

        public AdminManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetUsersAsync()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    id = u.Id,
                    name = u.FullName,
                    email = u.Email,
                    roleId = u.RoleId,
                    isActive = u.IsActive,
                    profileImage = u.ProfileImage,
                    createdAt = u.CreatedAt
                })
                .ToListAsync();

            return users.Select(u => new
            {
                u.id,
                u.name,
                u.email,
                role = RoleMap.ContainsKey(u.roleId) ? RoleMap[u.roleId] : "unknown",
                u.isActive,
                u.profileImage,
                u.createdAt
            }).ToList();
        }

        public async Task ToggleActiveAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("User not found");
            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("User not found");
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
