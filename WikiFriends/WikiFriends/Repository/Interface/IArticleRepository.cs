using WikiFriends.Models;

namespace WikiFriends.Repository.Interface;

public interface IArticleRepository : IRepository<Article>
{
    Task<List<Article>> GetArticlesByTitle(string title);
    Task<List<Article>> GetArticlesByTitlePaginated(string title, int pageNumber, int pageSize);
    Task<Article?> GetRandomArticle();
}