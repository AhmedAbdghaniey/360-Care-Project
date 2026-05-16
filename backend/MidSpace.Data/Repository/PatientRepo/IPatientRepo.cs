using MidSpace.Data.Models.user;
using MidSpace.Data.Repository.GenericRepository;

namespace MidSpace.Data.Repository.PatientRepo
{
    public interface IPatientRepo : IGenericRepo<Patient>
    {
        Task<Patient?> GetByUserIdAsync(int userId);
    }
}
