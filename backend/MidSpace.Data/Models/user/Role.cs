using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.user
{
    public class Role : IEntity, ISoftDelete
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string RoleName { get; set; }
        public ICollection<User> Users { get; set; } = new HashSet<User>();
    }
}
