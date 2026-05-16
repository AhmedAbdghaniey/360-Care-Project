using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.SocialDtos;
using MidSpace.Domain.Managers.Posts;
using System.Security.Claims;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostsManager _manager;

        public PostsController(IPostsManager manager)
        {
            _manager = manager;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePostDto dto)
        {
            var result = await _manager.CreatePostAsync(GetUserId(), dto);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _manager.GetPostByIdAsync(id, GetUserId());
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPosts(int userId)
        {
            var result = await _manager.GetUserPostsAsync(userId, GetUserId());
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePostDto dto)
        {
            try
            {
                var result = await _manager.UpdatePostAsync(id, GetUserId(), dto);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _manager.DeletePostAsync(id, GetUserId());
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> Like(int id)
        {
            var success = await _manager.LikePostAsync(id, GetUserId());
            return Ok(new { liked = success });
        }

        [HttpDelete("{id}/like")]
        public async Task<IActionResult> Unlike(int id)
        {
            var success = await _manager.UnlikePostAsync(id, GetUserId());
            return Ok(new { unliked = success });
        }
    }
}
