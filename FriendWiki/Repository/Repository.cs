using FriendWiki.Data;
using FriendWiki.Models;
using Microsoft.EntityFrameworkCore;

namespace FriendWiki.Repository;

public class Repository<T> where T : class, IModel
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }


    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
    
    #region Fetching

    public async Task<T?> GetById(long id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAll()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<IEnumerable<T>> GetPaginated(int page, int pageSize)
    {
        return await _dbSet
            .OrderBy(t => t.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
    
    #endregion

    #region Changing
    
    public async Task Create(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public void Update(T entity)
    {
        _dbSet.Attach(entity);
        _context.Entry(entity).State = EntityState.Modified;
    }
    
    #endregion
    
    #region Deleting
    
    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task DeleteById(long id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity == null)
        {
            throw new KeyNotFoundException($"Entity of type {typeof(T).Name} with id {id} was not found");
        }
        
        _dbSet.Remove(entity);
    }
    
    #endregion
}