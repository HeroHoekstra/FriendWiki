using Microsoft.EntityFrameworkCore;
using WikiFriends.Models;
using WikiFriends.Repository.Interface;

namespace WikiFriends.Repository;

public class Repository<T> : IRepository<T> where T : class, IEntity
{
    private readonly AppDbContext _context;

    public Repository(AppDbContext context)
    {
        _context = context;
    }
    
    // Fetching
    public async Task<T?> GetById(long id)
    {
        return await _context.Set<T>()
            .FindAsync(id);
    }

    public async Task<List<T>> GetAll()
    {
        return await _context.Set<T>()
            .ToListAsync();
    }

    public async Task<List<T>> GetRangeById(IEnumerable<long> ids)
    {
        return await _context.Set<T>()
            .Where(e => ids.Contains(e.Id))
            .ToListAsync();
    }
    
    // Posting
    public async Task Add(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
    }
    
    public async Task AddRange(IEnumerable<T> entities)
    {
        var entityList = entities.ToList();
        
        await _context.Set<T>().AddRangeAsync(entityList);
    }
    
    // Updating
    public void Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }

    public void UpdateRange(IEnumerable<T> entities)
    {
        var entityList = entities.ToList();
        
        _context.Set<T>().UpdateRange(entityList);
    }
    
    // Removing
    public void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }
    
    public async Task DeleteById(long id)
    {
        var entity = await _context.Set<T>().FindAsync(id);
        if (entity == null)
            throw new KeyNotFoundException($"Entity with id {id} not found");
        
        Delete(entity);
    }

    public void DeleteRange(IEnumerable<T> entities)
    {
        var entityList = entities.ToList();
        
        _context.Set<T>().RemoveRange(entityList);
    }

    public async Task DeleteRangeById(IEnumerable<long> ids)
    {
        var entityList = await _context.Set<T>()
            .Where(i => ids.Contains(i.Id))
            .ToListAsync();
        DeleteRange(entityList);
    }
    
    // Saving changes
    public async Task SaveChanges()
    {
        await _context.SaveChangesAsync();
    }
}