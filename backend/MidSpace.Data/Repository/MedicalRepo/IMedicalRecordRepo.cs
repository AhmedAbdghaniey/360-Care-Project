using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.MedicalRepo
{
    public interface IMedicalRecordRepo : IGenericRepo<MedicalRecord>
    {
        Task<MedicalRecord?> GetFullRecord(int id);
    }
}
