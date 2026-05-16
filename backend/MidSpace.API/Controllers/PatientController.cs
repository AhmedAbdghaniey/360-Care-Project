using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.PatientDtos;
using MidSpace.Domain.Managers.Patients;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]s")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientsManager _manager;

        public PatientController(IPatientsManager manager)
        {
            _manager = manager;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            var patient = await _manager.GetMyProfileAsync(userId);
            if (patient == null) return NotFound(new { message = "Patient profile not found" });
            return Ok(patient);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdatePatientDtos dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            try
            {
                await _manager.UpdateMyProfileAsync(userId, dto);
                return Ok(new { message = "Profile updated" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var patient = await _manager.GetPatientByIdAsync(id);
            if (patient == null) return NotFound(new { message = "Patient not found" });
            return Ok(patient);
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddPatientDtos dto)
        {
            await _manager.AddPatientAsync(dto);
            return Ok("Patient added successfully");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var patients = await _manager.GetAllPatientsAsync();
            if (patients == null || !patients.Any())
                return NotFound(new { message = "No patients found" });
            return Ok(patients);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdatePatientDtos dto)
        {
            await _manager.UpdatePatientAsync(id, dto);
            return Ok("Patient updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _manager.DeletePatientAsync(id);
            if (!deleted) return NotFound(new { message = "No patients found" });
            return Ok("Patient deleted successfully");
        }
    }
}
