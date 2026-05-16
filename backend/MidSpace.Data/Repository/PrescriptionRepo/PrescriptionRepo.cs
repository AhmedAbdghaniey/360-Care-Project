using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.PrescriptionRepo
{
    public class PrescriptionRepo : GenericRepo<Prescription>, IPrescriptionRepo
    {
        public PrescriptionRepo(ApplicationDbContext context) : base(context) { }

        public async Task<Prescription?> GetWithItems(int id)
        =>await _context.Prescriptions.
        Include(p=> p.Items)
        .FirstOrDefaultAsync(p=> p.Id == id);
        
    }
}
