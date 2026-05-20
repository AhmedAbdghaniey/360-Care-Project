using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.AvailabilityDtos;
using MidSpace.Domain.Managers.Availabilities;
using MidSpace.Domain.Managers.Doctors;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/doctors/{doctorId}/availability")]
    [ApiController]
    public class AvailabilityController : ControllerBase
    {
        private readonly IAvailabilityManager _manager;
        private readonly IDoctorsManager _doctorsManager;

        public AvailabilityController(IAvailabilityManager manager, IDoctorsManager doctorsManager)
        {
            _manager = manager;
            _doctorsManager = doctorsManager;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAvailability(int doctorId)
        {
            var availability = await _manager.GetDoctorAvailabilityAsync(doctorId);
            return Ok(availability);
        }

        [HttpPut]
        public async Task<IActionResult> SetAvailability(int doctorId, [FromBody] List<UpsertAvailabilityDtos> slots)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);
            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var doctor = await _doctorsManager.GetDoctorByIdAsync(doctorId);
            if (doctor == null) return NotFound(new { message = "Doctor not found" });

            if (roleClaim != "admin" && doctor.UserId != userId)
                return Forbid();

            await _manager.SetDoctorAvailabilityAsync(doctorId, slots);
            return Ok(new { message = "Availability updated successfully" });
        }
    }
}
