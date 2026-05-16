using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.DoctorRecommendationRepo
{
    public interface IDoctorRecommendationRepo : IGenericRepo<DoctorRecommendation>
    {
        Task<List<DoctorRecommendation>> GetByDoctorId(int  doctorId);
    }
}
