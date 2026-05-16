using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Dtos.SocialDtos;
using MidSpace.Domain.Managers.Comments;
using System.Security.Claims;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/posts/{postId}/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentsManager _manager;

        public CommentsController(ICommentsManager manager)
        {
            _manager = manager;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetComments(int postId)
        {
            var result = await _manager.GetPostCommentsAsync(postId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddComment(int postId, [FromBody] CreateCommentDto dto)
        {
            try
            {
                var result = await _manager.AddCommentAsync(postId, GetUserId(), dto);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Post not found" });
            }
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int postId, int commentId)
        {
            var success = await _manager.DeleteCommentAsync(commentId, GetUserId());
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
