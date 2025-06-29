using FriendWiki.Models;

namespace FriendWiki.Repository.Interface;

public interface IArticleRepository : IRepository<Article>
{
    new Task<Article?> GetById(long id);

    Task<long> GetRandomId();
    
    Task<(IEnumerable<Article>, int totalCount)> GetByTitlePaginated(string title, int page, int pageSize);
    
    new Task Update(Article article);
}