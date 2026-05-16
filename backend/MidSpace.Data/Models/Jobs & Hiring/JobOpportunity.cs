using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models
{
    public class JobOpportunity : IEntity, ISoftDelete
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string JobTitle { get; set; }
        public string? JobDescription { get; set; }
        public string? JobLocation { get; set; }
        public string? RequiredSpecialization { get; set; }
        public decimal? MinimumSalary { get; set; }
        public decimal? MaximumSalary { get; set; }
        public DateTime? ApplicationDeadline { get; set; }
        public DateTime? PostedDate { get; set; }
        public JobOpportunityStatus JobOpportunityStatus { get; set; }  // enum
        public int ? HospitalId { get; set; } // Fk
        public Hospital Hospital { get; set; } // Navigation Properity
        public ICollection<JobApplication> JobApplications { get; set; } = new HashSet<JobApplication>(); //Navigation Properity
        public ICollection<DoctorJobRecommendation> DoctorJobRecommendationS { get; set; } = new HashSet<DoctorJobRecommendation>();// Navigation Properity



    }
}
