using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.Appointments_Medical
{
    public class PrescriptionItem : IEntity,ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public int? PrescriptionId { get; set; } // FK
        public int? DrugId { get; set; } // FK

        public string? MedicationName { get; set; }
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }
        public string? Instructions { get; set; }

        public Prescription Prescription { get; set; } // Nav Prop
        public Drug Drug { get; set; }  // Nav Prop
    }
}
