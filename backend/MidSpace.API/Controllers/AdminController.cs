using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Managers.Admin;

namespace MidSpace.API.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminManager _manager;

        public AdminController(IAdminManager manager)
        {
            _manager = manager;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _manager.GetUsersAsync();
            return Ok(result);
        }

        [HttpPut("users/{id}/toggle-active")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            try
            {
                await _manager.ToggleActiveAsync(id);
                return Ok(new { message = "Status toggled" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _manager.DeleteUserAsync(id);
                return Ok(new { message = "User deleted" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
