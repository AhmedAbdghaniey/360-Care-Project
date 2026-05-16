using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.DrugRepo
{
    public class DrugRepo : GenericRepo<Drug> , IDrugRepo
    {
        public DrugRepo(ApplicationDbContext context) : base(context) { }

        public async Task<Drug?> GetByName(string name)
        => await _context.Drugs.FirstOrDefaultAsync(d=> d.DrugName == name);
        
    }
}
