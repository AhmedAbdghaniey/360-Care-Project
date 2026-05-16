using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.MedicalRepo
{
    public class MedicalRecordRepo: GenericRepo<MedicalRecord>, IMedicalRecordRepo
    {
        public MedicalRecordRepo(ApplicationDbContext context) : base(context) { }

        public async Task<MedicalRecord?> GetFullRecord(int id)
        => await _context.MedicalRecords.Include(m => m.Attachments)
           .Include(m => m.Prescriptions)
           .FirstOrDefaultAsync(m => m.Id == id);
                
        
    }
}
