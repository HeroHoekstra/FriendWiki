using FriendWiki.Models;

namespace FriendWiki.Repository.Interface;

public interface IArticleRepository : IRepository<Article>
{
    new Task<Article?> GetById(long id);

    new void Update(Article article);

    Task<long> GetRandomId();
    
    Task<(IEnumerable<Article>, int totalCount)> GetByTitlePaginated(string title, int page, int pageSize);
}