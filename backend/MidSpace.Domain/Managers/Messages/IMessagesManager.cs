namespace MidSpace.Domain.Managers.Messages
{
    public interface IMessagesManager
    {
        Task<object> GetConversationsAsync(int userId);
        Task<object> GetMessagesAsync(int currentUserId, int userId);
        Task<object> SendMessageAsync(int senderId, int receiverId, string content);
    }
}
