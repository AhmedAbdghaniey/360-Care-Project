using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;
using MidSpace.Data.Models;

namespace MidSpace.Data.Repository.PrescriptionRepo
{
    public interface IPrescriptionRepo : IGenericRepo<Prescription>
    {
        Task<Prescription?> GetWithItems(int id);
    }
}
