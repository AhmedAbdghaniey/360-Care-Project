using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.user
{
    public class PatientAllergy : IEntity, ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string AllergyName { get; set; }
        public int? PatientID { get; set; }
        public Patient Patient { get; set; }
    }
}
