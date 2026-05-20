using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.AppointmentDtos;
using MidSpace.Domain.Managers.Appointments;
using MidSpace.Data.Models.user;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]s")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentsManager _manager;

        public AppointmentController(IAppointmentsManager manager)
        {
            _manager = manager;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (roleClaim == null) return NotFound();

            try
            {
                var appointments = await _manager.GetMyAppointmentsAsync(userId, roleClaim);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddAppointmentDtos dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized(new { message = "You must be logged in" });
            var userId = int.Parse(userIdClaim);
            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (roleClaim == "patient")
            {
                var patient = await _manager.GetPatientByUserIdAsync(userId);
                if (patient == null)
                    return NotFound(new { message = "Patient profile not found" });
                dto.PatientId = patient.Id;
            }

            try
            {
                await _manager.AddAppointmentAsync(dto);
                return Ok(new { message = "Appointment added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _manager.GetAllAppointmentsAsync();
            return Ok(appointments ?? new List<GetAppointmentDtos>());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateAppointmentDtos dto)
        {
            await _manager.UpdateAppointmentAsync(id, dto);
            return Ok("Appointment updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _manager.DeleteAppointmentAsync(id);
            if (!deleted) return NotFound(new { message = "No appointments found" });
            return Ok("Appointment deleted successfully");
        }
    }
}
