using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Domain.Dtos.JobApplicationDtos;
using MidSpace.Domain.Managers.JobApplications;
using MidSpace.Data.Models;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationController : ControllerBase
    {
        private readonly IJobApplicationsManager _manager;
        private readonly ApplicationDbContext _context;

        public JobApplicationController(IJobApplicationsManager manager, ApplicationDbContext context)
        {
            _manager = manager;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddJobApplicationDtos dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized(new { message = "You must be logged in" });
            var userId = int.Parse(userIdClaim);
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctor == null) return BadRequest(new { message = "Only doctors can apply for jobs. Please register as a doctor first." });
            dto.DoctorId = doctor.Id;
            if ((int)dto.JobApplicationStatus == 0) dto.JobApplicationStatus = JobApplicationStatus.Submitted;
            await _manager.AddJobApplicationAsync(dto);
            return Ok(new { message = "Job application added successfully" });
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMy()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized(new { message = "You must be logged in" });
            var userId = int.Parse(userIdClaim);

            try
            {
                var result = await _manager.GetMyJobApplicationsAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var applications = await _manager.GetAllJobApplicationsAsync();
            return Ok(applications ?? new List<GetJobApplicationDtos>());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateJobApplicationDtos dto)
        {
            await _manager.UpdateJobApplicationAsync(id, dto);
            return Ok("Job application updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _manager.DeleteJobApplicationAsync(id);
            if (!deleted) return NotFound(new { message = "No job applications found" });
            return Ok("Job application deleted successfully");
        }
    }
}
