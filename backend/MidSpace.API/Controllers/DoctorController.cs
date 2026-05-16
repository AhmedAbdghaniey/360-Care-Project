using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.DoctorDtos;
using MidSpace.Domain.Managers.Doctors;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]s")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorsManager _manager;

        public DoctorController(IDoctorsManager manager)
        {
            _manager = manager;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            var doctor = await _manager.GetMyProfileAsync(userId);
            if (doctor == null) return NotFound(new { message = "Doctor profile not found" });
            return Ok(doctor);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateDoctorDtos dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            try
            {
                await _manager.UpdateMyProfileAsync(userId, dto);
                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var doctor = await _manager.GetDoctorByIdAsync(id);
            if (doctor == null) return NotFound(new { message = "Doctor not found" });
            return Ok(doctor);
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddDoctorDtos dto)
        {
            await _manager.AddDoctorAsync(dto);
            return Ok("Doctor added successfully");
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _manager.GetAllDoctorsAsync();
            return Ok(doctors ?? new List<GetDoctorDtos>());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDoctorDtos dto)
        {
            await _manager.UpdateDoctorAsync(id, dto);
            return Ok("Doctor updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _manager.DeleteDoctorAsync(id);
            if (!deleted) return NotFound(new { message = "No doctors found" });
            return Ok("Doctor deleted successfully");
        }
    }
}
