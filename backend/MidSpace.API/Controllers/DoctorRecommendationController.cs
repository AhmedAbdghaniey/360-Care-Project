using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.DoctorRecommendationDtos;
using MidSpace.Domain.Managers.DoctorRecommendations;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorRecommendationController : ControllerBase
    {
        private readonly IDoctorRecommendationsManager _manager;
        public DoctorRecommendationController(IDoctorRecommendationsManager manager)
        {
            _manager = manager;
        }
        [HttpPost]
        public async Task<IActionResult> Add(AddDoctorRecommendationDtos dto)
        {
            await _manager.AddDoctorRecommendationAsync(dto);
            return Ok("Doctor recommendation added successfully");
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var recommendations = await _manager.GetAllDoctorRecommendationsAsync();

            if (recommendations == null || !recommendations.Any())
            {
                return NotFound(new { message = "No doctor recommendations found" });
            }

            return Ok(recommendations);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDoctorRecommendationDtos dto)
        {
            await _manager.UpdateDoctorRecommendationAsync(id, dto);
            return Ok("Doctor recommendation updated successfully");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var recommendations = await _manager.GetAllDoctorRecommendationsAsync();

            if (recommendations == null)
            {
                return NotFound(new { message = "No doctor recommendations found" });
            }
            await _manager.DeleteDoctorRecommendationAsync(id);
            return Ok("Doctor recommendation deleted successfully");
        }
    }
}
