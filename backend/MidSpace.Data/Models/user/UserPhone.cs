using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.user
{
    public class UserPhone : IEntity, ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
