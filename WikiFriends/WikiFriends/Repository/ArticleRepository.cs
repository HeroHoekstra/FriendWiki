using Microsoft.EntityFrameworkCore;
using WikiFriends.Models;
using WikiFriends.Repository.Interface;

namespace WikiFriends.Repository;

public class ArticleRepository : Repository<Article>, IArticleRepository
{
    private readonly AppDbContext _context;

    public ArticleRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public new async Task<Article?> GetById(long id)
    {
        return await _context.Set<Article>()
            .Include(a => a.Paragraphs)
            .Where(a => a.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Article>> GetArticlesByTitle(string title)
    {
        return await _context.Set<Article>()
            .Where(a => a.Title.ToLower().Contains(title.ToLower()))
            .ToListAsync();
    }

    public async Task<List<Article>> GetArticlesByTitlePaginated(string title, int pageNumber, int pageSize)
    {
        return await _context.Set<Article>()
            .Where(a => a.Title.ToLower().Contains(title.ToLower()))
            .OrderBy(a => a.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Article?> GetRandomArticle()
    {
        return await _context.Set<Article>()
            .OrderBy(a => Guid.NewGuid())
            .FirstOrDefaultAsync();
    }
}