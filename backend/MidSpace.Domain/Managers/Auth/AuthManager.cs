using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MidSpace.Data.Data;
using MidSpace.Data.Models;
using MidSpace.Data.Models.user;
using MidSpace.Data.Repository.UserRepo;
using MidSpace.Data.Models.Social;
using MidSpace.Domain.Dtos.AuthDtos;

namespace MidSpace.Domain.Managers.Auth
{
    public class AuthManager : IAuthManager
    {
        private readonly IUserRepo _userRepo;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        private static readonly Dictionary<string, int> RoleMap = new()
        {
            { "doctor", 1 },
            { "patient", 2 },
            { "hospital", 3 },
            { "admin", 4 }
        };

        public AuthManager(IUserRepo userRepo, ApplicationDbContext context, IConfiguration configuration)
        {
            _userRepo = userRepo;
            _context = context;
            _configuration = configuration;
        }

        public async Task<object> RegisterAsync(RegisterDtos dto)
        {
            var existingUser = await _userRepo.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                throw new Exception("Email already exists");

            var roleLower = dto.Role.ToLower();
            if (!RoleMap.ContainsKey(roleLower))
                throw new Exception("Invalid role");

            var user = new User
            {
                FullName = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = RoleMap[roleLower],
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepo.AddAsync(user);

            // Auto-create profile based on role
            if (roleLower == "doctor")
            {
                var doctor = new Doctor
                {
                    UserId = user.Id,
                    Specialization = "General",
                    ExperienceYears = 0,
                    ConsultationFee = 0,
                    Bio = "",
                    LicenseNumber = "",
                };
                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();
            }
            else if (roleLower == "patient")
            {
                var patient = new Patient
                {
                    UserId = user.Id,
                    DOB = DateTime.UtcNow,
                    Gender = "",
                    Address = "",
                    BloodType = "",
                    EmergencyContact = "",
                };
                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();
            }
            else if (roleLower == "hospital")
            {
                var hospital = new MidSpace.Data.Models.Hospital
                {
                    UserId = user.Id,
                    HospitalName = user.FullName,
                    HospitalAddress = "",
                    ContactPhoneNumber = "",
                    ContactEmail = user.Email,
                    OfficialWebsiteUrl = "",
                    HospitalDescription = "",
                };
                _context.Hospitals.Add(hospital);
                await _context.SaveChangesAsync();
            }

            var token = GenerateJwtToken(user);

            string? specialty = null;
            if (roleLower == "doctor")
            {
                var doc = _context.Doctors.FirstOrDefault(d => d.UserId == user.Id);
                specialty = doc?.Specialization;
            }

            return new
            {
                token,
                id = user.Id,
                name = user.FullName,
                email = user.Email,
                role = roleLower,
                specialty,
                profileImage = user.ProfileImage
            };
        }

        public async Task<object> LoginAsync(LoginDtos dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("Invalid email or password");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid email or password");

            var token = GenerateJwtToken(user);

            var roleName = RoleMap.FirstOrDefault(x => x.Value == user.RoleId).Key ?? "unknown";

            string? specialty = null;
            if (roleName == "doctor")
            {
                var doc = _context.Doctors.FirstOrDefault(d => d.UserId == user.Id);
                specialty = doc?.Specialization;
            }

            return new
            {
                token,
                id = user.Id,
                name = user.FullName,
                email = user.Email,
                role = roleName,
                specialty,
                profileImage = user.ProfileImage
            };
        }

        public async Task UpdateProfileAsync(int userId, string fullName, string? profileImage)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new Exception("User not found");

            user.FullName = fullName;
            if (profileImage != null)
                user.ProfileImage = profileImage;

            await _context.SaveChangesAsync();
        }

        public async Task ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new Exception("User not found");

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
                throw new Exception("Current password is incorrect");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMyAccountAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Doctor).ThenInclude(d => d!.Certificates)
                .Include(u => u.Doctor).ThenInclude(d => d!.Availabilities)
                .Include(u => u.Doctor).ThenInclude(d => d!.JobApplications)
                .Include(u => u.Doctor).ThenInclude(d => d!.DoctorJobRecommendationS)
                .Include(u => u.Doctor).ThenInclude(d => d!.Appointments)
                .Include(u => u.Doctor).ThenInclude(d => d!.Recommendations)
                .Include(u => u.Doctor).ThenInclude(d => d!.Prescriptions)
                .Include(u => u.Patient).ThenInclude(p => p!.Allergies)
                .Include(u => u.Patient).ThenInclude(p => p!.Diseases)
                .Include(u => u.Patient).ThenInclude(p => p!.Appointments)
                .Include(u => u.Patient).ThenInclude(p => p!.MedicalRecords)
                .Include(u => u.Phones)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            _context.Comments.RemoveRange(await _context.Comments.Where(c => c.UserId == userId).ToListAsync());
            _context.PostLikes.RemoveRange(await _context.PostLikes.Where(pl => pl.UserId == userId).ToListAsync());
            _context.Follows.RemoveRange(await _context.Follows.Where(f => f.FollowerId == userId || f.FolloweeId == userId).ToListAsync());

            _context.Posts.RemoveRange(await _context.Posts.Where(p => p.UserId == userId).ToListAsync());

            var hospital = await _context.Hospitals
                .Include(h => h.JobOpportunitys)
                .FirstOrDefaultAsync(h => h.UserId == userId);
            if (hospital != null)
                _context.Hospitals.Remove(hospital);

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var roleName = RoleMap.FirstOrDefault(x => x.Value == user.RoleId).Key ?? "unknown";

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, roleName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
