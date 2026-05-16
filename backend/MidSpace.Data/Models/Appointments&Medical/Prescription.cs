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
    public class Prescription : IEntity,ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public int? PatientId { get; set; }  // Fk
        public int? DoctorId { get; set; }  // Fk
        public int? MedicalRecordId { get; set; }// fk

        public DateTime? Date { get; set; }

        public Patient Patient { get; set; } // Nav Prop
        public Doctor Doctor { get; set; }  // Nav Prop
        public MedicalRecord MedicalRecord { get; set; } // Nav Prop

        public ICollection<PrescriptionItem> Items { get; set; }
            = new HashSet<PrescriptionItem>(); // Nav Prop
    }
}
