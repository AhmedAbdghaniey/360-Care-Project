using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Managers.Follows;
using System.Security.Claims;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FollowsController : ControllerBase
    {
        private readonly IFollowsManager _manager;

        public FollowsController(IFollowsManager manager)
        {
            _manager = manager;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost("{followeeId}")]
        public async Task<IActionResult> Follow(int followeeId)
        {
            var success = await _manager.FollowUserAsync(GetUserId(), followeeId);
            return Ok(new { followed = success });
        }

        [HttpDelete("{followeeId}")]
        public async Task<IActionResult> Unfollow(int followeeId)
        {
            var success = await _manager.UnfollowUserAsync(GetUserId(), followeeId);
            return Ok(new { unfollowed = success });
        }

        [HttpGet("followers/{userId}")]
        public async Task<IActionResult> GetFollowers(int userId)
        {
            var result = await _manager.GetFollowersAsync(userId);
            return Ok(result);
        }

        [HttpGet("following/{userId}")]
        public async Task<IActionResult> GetFollowing(int userId)
        {
            var result = await _manager.GetFollowingAsync(userId);
            return Ok(result);
        }

        [HttpGet("check/{followeeId}")]
        public async Task<IActionResult> IsFollowing(int followeeId)
        {
            var result = await _manager.IsFollowingAsync(GetUserId(), followeeId);
            return Ok(new { isFollowing = result });
        }

        [HttpGet("counts/{userId}")]
        public async Task<IActionResult> GetCounts(int userId)
        {
            var followers = await _manager.GetFollowerCountAsync(userId);
            var following = await _manager.GetFollowingCountAsync(userId);
            return Ok(new { followers, following });
        }
    }
}
