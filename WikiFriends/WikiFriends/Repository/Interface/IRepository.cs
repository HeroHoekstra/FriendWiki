using WikiFriends.Models;

namespace WikiFriends.Repository.Interface;

public interface IRepository<T> where T : class, IEntity
{
    // Fetching
    Task<T?> GetById(long id);
    Task<List<T>> GetAll();
    Task<List<T>> GetRangeById(IEnumerable<long> ids);
    
    // Adding
    Task Add(T entity);
    Task AddRange(IEnumerable<T> entities);
    
    // Updating
    void Update(T entity);
    void UpdateRange(IEnumerable<T> entities);
    
    // Deleting
    void Delete(T entity);
    Task DeleteById(long id);
    void DeleteRange(IEnumerable<T> entities);
    Task DeleteRangeById(IEnumerable<long> ids);
    Task SaveChanges();
}