using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.DrugDtos;
using MidSpace.Domain.Managers.Drugs;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DrugController : ControllerBase
    {
        private readonly IDrugsManager _manager;
        public DrugController(IDrugsManager manager)
        {
            _manager = manager;
        }
        [HttpPost]
        public async Task<IActionResult> Add(AddDrugDtos dto)
        {
            await _manager.AddDrugAsync(dto);
            return Ok("Drug added successfully");
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var drugs = await _manager.GetAllDrugsAsync();

            if (drugs == null || !drugs.Any())
            {
                return NotFound(new { message = "No drugs found" });
            }

            return Ok(drugs);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDrugDtos dto)
        {
            await _manager.UpdateDrugAsync(id, dto);
            return Ok("Drug updated successfully");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var drugs = await _manager.GetAllDrugsAsync();

            if (drugs == null)
            {
                return NotFound(new { message = "No drugs found" });
            }
            await _manager.DeleteDrugAsync(id);
            return Ok("Drug deleted successfully");
        }
    }
}
