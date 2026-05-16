using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.MedicalRecordDtos;
using MidSpace.Domain.Managers.MedicalRecords;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordController : ControllerBase
    {
        private readonly IMedicalRecordsManager _manager;
        public MedicalRecordController(IMedicalRecordsManager manager)
        {
            _manager = manager;
        }
        [HttpPost]
        public async Task<IActionResult> Add(AddMedicalRecordDtos dto)
        {
            await _manager.AddMedicalRecordAsync(dto);
            return Ok("Medical record added successfully");
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var records = await _manager.GetAllMedicalRecordsAsync();

            if (records == null || !records.Any())
            {
                return NotFound(new { message = "No medical records found" });
            }

            return Ok(records);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateMedicalRecordDtos dto)
        {
            await _manager.UpdateMedicalRecordAsync(id, dto);
            return Ok("Medical record updated successfully");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var records = await _manager.GetAllMedicalRecordsAsync();

            if (records == null)
            {
                return NotFound(new { message = "No medical records found" });
            }
            await _manager.DeleteMedicalRecordAsync(id);
            return Ok("Medical record deleted successfully");
        }
    }
}
