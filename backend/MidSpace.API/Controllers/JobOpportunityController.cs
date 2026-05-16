using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.JobOpportunityDtos;
using MidSpace.Domain.Managers.JobOpportunities;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/jobs")]
    [ApiController]
    public class JobOpportunityController : ControllerBase
    {
        private readonly IJobOpportunitiesManager _manager;

        public JobOpportunityController(IJobOpportunitiesManager manager)
        {
            _manager = manager;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyJobs()
        {
            var jobs = await _manager.GetMyJobsAsync();
            return Ok(jobs);
        }

        [HttpGet("applications")]
        public async Task<IActionResult> GetApplications()
        {
            var apps = await _manager.GetApplicationsAsync();
            return Ok(apps);
        }

        [HttpPut("{jobId}/applications/{id}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(int jobId, int id, [FromBody] UpdateStatusDto dto)
        {
            try
            {
                await _manager.UpdateApplicationStatusAsync(jobId, id, dto.Status);
                return Ok(new { message = "Status updated" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var job = await _manager.GetJobByIdAsync(id);
            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddJobOpportunityDtos dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _manager.AddJobOpportunityAsync(dto, userId);
            return Ok(new { message = "Job opportunity added successfully" });
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var opportunities = await _manager.GetAllJobOpportunitiesAsync();
            return Ok(opportunities ?? new List<GetJobOpportunityDtos>());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateJobOpportunityDtos dto)
        {
            await _manager.UpdateJobOpportunityAsync(id, dto);
            return Ok("Job opportunity updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _manager.DeleteJobOpportunityAsync(id);
            if (!deleted) return NotFound(new { message = "Job opportunity not found" });
            return Ok("Job opportunity deleted successfully");
        }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = "Pending";
    }
}
