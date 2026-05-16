using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Repository.GenericRepository
{
    public interface IGenericRepo<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task Update(T entity);
        Task Delete(int id);
        Task SaveChangesAsync();
        IQueryable<T> Query();
    }
}
