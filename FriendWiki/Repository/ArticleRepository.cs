using FriendWiki.Data;
using FriendWiki.Models;
using FriendWiki.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace FriendWiki.Repository;

public class ArticleRepository : Repository<Article>, IArticleRepository
{
    public ArticleRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Article>> GetByTitlePaginated(string title, int page, int pageSize)
    {
        return await _dbSet
            .OrderBy(a => a.Id)
            .Where(a => a.Title.Contains(title))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
    
}