using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models;

namespace MidSpace.Domain.Managers.Messages
{
    public class MessagesManager : IMessagesManager
    {
        private readonly ApplicationDbContext _context;

        public MessagesManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetConversationsAsync(int userId)
        {
            var messages = await _context.Messages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            var grouped = messages
                .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .ToList();

            var contactIds = grouped.Select(g => g.Key).ToList();
            var users = await _context.Users
                .Where(u => contactIds.Contains(u.Id))
                .ToListAsync();

            var userDict = users.ToDictionary(u => u.Id, u => u.FullName);
            var profileDict = users.ToDictionary(u => u.Id, u => u.ProfileImage);

            var result = grouped.Select(g =>
            {
                var last = g.First();
                userDict.TryGetValue(g.Key, out var name);
                profileDict.TryGetValue(g.Key, out var img);
                return new
                {
                    userId = g.Key,
                    userName = name ?? "Unknown",
                    profileImage = img,
                    lastMessage = last.Content,
                    lastMessageAt = last.SentAt
                };
            }).OrderByDescending(x => x.lastMessageAt);

            return result.ToList();
        }

        public async Task<object> GetMessagesAsync(int currentUserId, int userId)
        {
            var messages = await _context.Messages
                .Where(m => (m.SenderId == currentUserId && m.ReceiverId == userId) ||
                            (m.SenderId == userId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.SentAt)
                .Select(m => new
                {
                    id = m.Id,
                    senderId = m.SenderId,
                    content = m.Content,
                    sentAt = m.SentAt
                })
                .ToListAsync();

            return messages;
        }

        public async Task<object> SendMessageAsync(int senderId, int receiverId, string content)
        {
            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return new { id = message.Id, sentAt = message.SentAt };
        }
    }
}
