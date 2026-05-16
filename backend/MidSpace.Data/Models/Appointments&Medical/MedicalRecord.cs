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
    public class MedicalRecord : IEntity , ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public int? PatientId { get; set; }  //fk
        public int? DoctorId { get; set; }  //fk
        public int? AppointmentId { get; set; }  //fk

        public string? Symptoms { get; set; }
        public string? Diagnosis { get; set; }
        public string? TreatmentPlan { get; set; }
        public string? VisitType { get; set; }
        public DateTime? CreatedAt { get; set; }

        public Patient Patient { get; set; } // Nav Prop
        public Doctor Doctor { get; set; }  // Nav Prop
        public Appointment Appointment { get; set; } //Nav Prop

        public ICollection<MedicalAttachment> Attachments { get; set; } 
            = new HashSet<MedicalAttachment>(); // Nav Prop
        public ICollection<Prescription> Prescriptions { get; set; }
            =new HashSet<Prescription>();
    }
}
