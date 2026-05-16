using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;
using MidSpace.Data.Models.user;

namespace MidSpace.Data.Models
{
    public class Hospital : IEntity,ISoftDelete
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public string HospitalName { get; set; }
        public string? HospitalAddress { get; set; }
        public string? ContactPhoneNumber { get; set; }
        public string? ContactEmail { get; set; }
        public string? OfficialWebsiteUrl { get; set; }
        public string? HospitalDescription { get; set; }
        public ICollection<JobOpportunity> JobOpportunitys { get; set; }
        = new HashSet<JobOpportunity>();// Navigation Properity

    }
}
