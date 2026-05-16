using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.user
{
    public class Admin : IEntity, ISoftDelete
    {
        [Key, ForeignKey("User")]
        public int Id { get; set; } 
        public bool IsDeleted { get; set; }

        public string Role { get; set; } 

        public virtual User User { get; set; }
    }
}
