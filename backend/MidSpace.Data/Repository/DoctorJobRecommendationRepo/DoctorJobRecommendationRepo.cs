using MidSpace.Data.Data;
using MidSpace.Data.Models;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.DoctorJobRecommendationRepo
{
    public class DoctorJobRecommendationRepo : GenericRepo<DoctorJobRecommendation>, IDoctorJobRecommendationRepo
    {
        public DoctorJobRecommendationRepo(ApplicationDbContext context) : base(context) { }
    }
}
