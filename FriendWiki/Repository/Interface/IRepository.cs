namespace FriendWiki.Repository.Interface;

public interface IRepository<T> where T : class
{
    Task Save();
    
    Task<T?> GetById(long id);
    Task<IEnumerable<T>> GetAll();
    Task<IEnumerable<T>> GetPaginated(int page, int pageSize);
    
    Task Create(T entity);
    void Update(T entity);
    
    void Delete(T entity);
    Task DeleteById(long id);
}