using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;
using MidSpace.Data.Models.user;

namespace MidSpace.Data.Models
{
    public class JobApplication : IEntity, ISoftDelete
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? ApplicationSubmittedAt { get; set; }
        public string? CVFileUrl { get; set; }
        public string? CoverLetterText { get; set; }
        public JobApplicationStatus JobApplicationStatus { get; set; } // enum
        public int? JobOpportunityId { get; set; } // Fk
        public JobOpportunity JobOpportunity { get; set; } // Navigation Properity
        public int? DoctorId { get; set; } //    FK
        public Doctor Doctor { get; set; } // Navigation Properity


    }
}
