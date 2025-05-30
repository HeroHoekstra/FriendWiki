using FriendWiki.Models;

namespace FriendWiki.Repository.Interface;

public interface IArticleRepository : IRepository<Article>
{
    new Task<Article?> GetById(long id);
    
    Task<IEnumerable<Article>> GetByTitlePaginated(string title, int page, int pageSize);
}