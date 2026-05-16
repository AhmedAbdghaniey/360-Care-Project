using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Managers.Feed;
using System.Security.Claims;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FeedController : ControllerBase
    {
        private readonly IFeedManager _manager;

        public FeedController(IFeedManager manager)
        {
            _manager = manager;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _manager.GetFeedAsync(GetUserId(), page, pageSize);
            return Ok(result);
        }
    }
}
