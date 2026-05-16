using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.HospitalDtos;
using MidSpace.Domain.Managers.Hospitals;

namespace MidSpace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalController : ControllerBase
    {
        private readonly IHospitalsManager _manager;
        public HospitalController(IHospitalsManager manager)
        {
            _manager = manager;
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var hospital = await _manager.GetHospitalByIdAsync(id);
            if (hospital == null) return NotFound(new { message = "Hospital not found" });
            return Ok(hospital);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyHospital()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            var hospital = await _manager.GetHospitalByUserIdAsync(userId);
            if (hospital == null) return NotFound(new { message = "Hospital profile not found" });

            return Ok(hospital);
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyHospital(UpdateHospitalDtos dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            await _manager.UpdateHospitalByUserIdAsync(userId, dto);
            return Ok(new { message = "Hospital updated successfully" });
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Add(AddHospitalDtos dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            await _manager.AddHospitalAsync(dto, userId);
            return Ok("Hospital added successfully");
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var hospitals = await _manager.GetAllHospitalsAsync();
            return Ok(hospitals ?? new List<GetHospitalDtos>());
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateHospitalDtos dto)
        {
            await _manager.UpdateHospitalAsync(id, dto);
            return Ok("Hospital updated successfully");
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var hospitals = await _manager.GetAllHospitalsAsync();

            if (hospitals == null)
            {
                return NotFound(new { message = "No hospitals found" });
            }
            await _manager.DeleteHospitalAsync(id);
            return Ok("Hospital deleted successfully");
        }
    }
}
