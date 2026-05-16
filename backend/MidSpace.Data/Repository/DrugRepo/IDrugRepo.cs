using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.DrugRepo
{
    public interface IDrugRepo : IGenericRepo<Drug>
    {
        Task<Drug?> GetByName(string name);
    }
}
