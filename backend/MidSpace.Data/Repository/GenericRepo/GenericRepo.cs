using Microsoft.EntityFrameworkCore;
using MidSpace.Data.Data;
using MidSpace.Data.Interfaces;

namespace MidSpace.Data.Repository.GenericRepository
{
    public class GenericRepo<T> : IGenericRepo<T> where T : class
    {
        protected readonly ApplicationDbContext _context;

        public GenericRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public IQueryable<T> Query() => _context.Set<T>();

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            IQueryable<T> query = _context.Set<T>();
            if (typeof(ISoftDelete).IsAssignableFrom(typeof(T)))
                query = query.Where(e => !EF.Property<bool>(e, "IsDeleted"));
            return await query.ToListAsync();
        }

        public virtual async Task<T?> GetByIdAsync(int id)
        {
            IQueryable<T> query = _context.Set<T>();
            if (typeof(ISoftDelete).IsAssignableFrom(typeof(T)))
                query = query.Where(e => !EF.Property<bool>(e, "IsDeleted"));
            return await query.FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id);
        }

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Update(T entity)
        {
            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            if (entity == null) return;
            if (entity is ISoftDelete softDelete)
                softDelete.IsDeleted = true;
            else
                _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
