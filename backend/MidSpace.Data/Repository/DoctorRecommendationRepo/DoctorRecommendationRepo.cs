using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Models.Appointments_Medical;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.DoctorRecommendationRepo
{
    public class DoctorRecommendationRepo : GenericRepo<DoctorRecommendation> , IDoctorRecommendationRepo
    {
        public DoctorRecommendationRepo(ApplicationDbContext context) : base(context) { }

        public async Task<List<DoctorRecommendation>> GetByDoctorId(int doctorId)
        => await _context.DoctorRecommendations.Where(d => d.DoctorId == doctorId).ToListAsync();
    }
}
