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
    public class Appointment : IEntity , ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; } // 
        public int? PatientId { get; set; } // Fk
        public int? DoctorId { get; set; }  //Fk

        public DateTime? AppointmentDate { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
        public decimal? ConsultationFeeAtBooking { get; set; }
        public string? CancellationReason { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Patient Patient { get; set; } // Nav Prop
        public Doctor Doctor { get; set; } // Nav Prop

        public ICollection<MedicalRecord> MedicalRecords { get; set; }
            = new HashSet<MedicalRecord>(); // Nav Prop
    }
}
