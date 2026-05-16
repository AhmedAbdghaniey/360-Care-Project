using Microsoft.Identity.Client;
using MidSpace.Data.Interfaces;
using MidSpace.Data.Models.user;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MidSpace.Data.Models
{
    public class DoctorJobRecommendation : IEntity,ISoftDelete
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string RecommendationMessage { get; set; }
        public string? HRDecisionNotes { get; set; }
        public DateTime? RecommendationCreatedAt { get; set; }
        public RecommendationStatus RecommendationStatus { get; set; } // enum
        public int? DoctorId { get; set; } // FK  
        public Doctor Doctor { get; set; } // Navigation Properity
        public int? JobOpportunityId { get; set; } // FK  
        public JobOpportunity JobOpportunity { get; set; } // Navigation Properity



    }
}
