using System.ComponentModel.DataAnnotations;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models
{
    public class Message : IEntity
    {
        [Key]
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; }
    }
}
