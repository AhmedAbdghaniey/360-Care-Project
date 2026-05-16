using MidSpace.Data.Interfaces;
using MidSpace.Data.Models.user;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MidSpace.Data.Models.Appointments_Medical
{
    public class DoctorRecommendation : IEntity,ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; } // Based On ISoftDeleted
        public int? PatientId { get; set; } // fk
        public int? DoctorId { get; set; }  //fk

        public int? RankOrder { get; set; }
        public string? Reason { get; set; }
        public string? RecommendationSource { get; set; }

        public Patient Patient { get; set; }  // Nav Prop
        public Doctor Doctor { get; set; }  // Nav Prop
    }
}
