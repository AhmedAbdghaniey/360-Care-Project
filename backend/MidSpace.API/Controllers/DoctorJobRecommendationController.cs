using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.DoctorJobRecommendationDtos;
using MidSpace.Domain.Managers.DoctorJobRecommendations;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorJobRecommendationController : ControllerBase
    {
        private readonly IDoctorJobRecommendationsManager _manager;
        public DoctorJobRecommendationController(IDoctorJobRecommendationsManager manager)
        {
            _manager = manager;
        }
        [HttpPost]
        public async Task<IActionResult> Add(AddDoctorJobRecommendationDtos dto)
        {
            await _manager.AddDoctorJobRecommendationAsync(dto);
            return Ok("Doctor job recommendation added successfully");
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var recommendations = await _manager.GetAllDoctorJobRecommendationsAsync();

            if (recommendations == null || !recommendations.Any())
            {
                return NotFound(new { message = "No doctor job recommendations found" });
            }

            return Ok(recommendations);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDoctorJobRecommendationDtos dto)
        {
            await _manager.UpdateDoctorJobRecommendationAsync(id, dto);
            return Ok("Doctor job recommendation updated successfully");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var recommendations = await _manager.GetAllDoctorJobRecommendationsAsync();

            if (recommendations == null)
            {
                return NotFound(new { message = "No doctor job recommendations found" });
            }
            await _manager.DeleteDoctorJobRecommendationAsync(id);
            return Ok("Doctor job recommendation deleted successfully");
        }
    }
}
