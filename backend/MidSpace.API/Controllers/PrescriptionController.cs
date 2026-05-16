using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.PrescriptionDtos;
using MidSpace.Domain.Managers.Prescriptions;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly IPrescriptionsManager _manager;
        public PrescriptionController(IPrescriptionsManager manager)
        {
            _manager = manager;
        }
        [HttpPost]
        public async Task<IActionResult> Add(AddPrescriptionDtos dto)
        {
            await _manager.AddPrescriptionAsync(dto);
            return Ok("Prescription added successfully");
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var prescriptions = await _manager.GetAllPrescriptionsAsync();

            if (prescriptions == null || !prescriptions.Any())
            {
                return NotFound(new { message = "No prescriptions found" });
            }

            return Ok(prescriptions);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdatePrescriptionDtos dto)
        {
            await _manager.UpdatePrescriptionAsync(id, dto);
            return Ok("Prescription updated successfully");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var prescriptions = await _manager.GetAllPrescriptionsAsync();

            if (prescriptions == null)
            {
                return NotFound(new { message = "No prescriptions found" });
            }
            await _manager.DeletePrescriptionAsync(id);
            return Ok("Prescription deleted successfully");
        }
    }
}
