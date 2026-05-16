using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.Appointments_Medical
{
    public class Drug : IEntity,ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string DrugName { get; set; }

        public ICollection<PrescriptionItem> PrescriptionItems { get; set; }
        = new HashSet<PrescriptionItem>(); // Nav Prop
    }
}
