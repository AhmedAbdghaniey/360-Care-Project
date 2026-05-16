using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;
using MidSpace.Data.Models.user;

namespace MidSpace.Data.Models
{
    public class User : IEntity, ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? ProfileImage { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<UserPhone> Phones { get; set; } = new HashSet<UserPhone>();
        public virtual Doctor? Doctor { get; set; } 
        public virtual Patient? Patient { get; set; }
        public virtual Admin? Admin { get; set; }
       

    }
}
