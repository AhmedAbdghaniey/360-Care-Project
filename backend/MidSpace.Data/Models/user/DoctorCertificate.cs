using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.user
{
    public class DoctorCertificate : IEntity, ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public string CertificateName { get; set; }
        public string IssuingOrganization { get; set; }
        public DateTime IssueDate { get; set; }
        public int? DoctorID { get; set; }
        public Doctor Doctor { get; set; }
    }
}
