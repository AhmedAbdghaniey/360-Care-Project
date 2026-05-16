using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MidSpace.Domain.Managers.Messages;

namespace MidSpace.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMessagesManager _manager;

        public MessagesController(IMessagesManager manager)
        {
            _manager = manager;
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim);

            var result = await _manager.GetConversationsAsync(userId);
            return Ok(result);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMessages(int userId)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var currentUserId = int.Parse(userIdClaim);

            var result = await _manager.GetMessagesAsync(currentUserId, userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var senderId = int.Parse(userIdClaim);

            var result = await _manager.SendMessageAsync(senderId, dto.ReceiverId, dto.Content);
            return Ok(result);
        }
    }

    public class SendMessageDto
    {
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
