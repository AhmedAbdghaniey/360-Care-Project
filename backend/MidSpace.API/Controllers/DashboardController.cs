using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Managers.Dashboard;

namespace MidSpace.API.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardManager _manager;

        public DashboardController(IDashboardManager manager)
        {
            _manager = manager;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var result = await _manager.GetDashboardAsync();
            return Ok(result);
        }
    }
}
