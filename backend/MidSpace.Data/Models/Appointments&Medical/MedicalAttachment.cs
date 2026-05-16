using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Models.Appointments_Medical
{
    public class MedicalAttachment : IEntity, ISoftDelete
    {
        [Key]
        public int Id { get; set; }
        public bool IsDeleted { get; set; }

        public int? RecordId { get; set; } //fk

        public string? FileURL { get; set; }
        public string? FileType { get; set; }
        public DateTime? UploadedAt { get; set; }

        public MedicalRecord MedicalRecord { get; set; } // Nav Prop
    }
}
