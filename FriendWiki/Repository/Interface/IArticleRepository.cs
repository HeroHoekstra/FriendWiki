using FriendWiki.Models;

namespace FriendWiki.Repository.Interface;

public interface IArticleRepository : IRepository<Article>
{
    Task<IEnumerable<Article>> GetByTitlePaginated(string title, int page, int pageSize);
}