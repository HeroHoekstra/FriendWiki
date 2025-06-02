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

    public new async Task<Article?> GetById(long id)
    {
        return await _dbSet
            .Where(a => a.Id == id)
            .Include(a => a.Summary)
                .ThenInclude(s => s.Rows)
            .Include(a => a.Summary)
                .ThenInclude(s => s.Image)
            .Include(a => a.Paragraphs)
                .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync();
    }

    public new void Update(Article article)
    {
        _context.Attach(article);
        _context.Entry(article).State = EntityState.Modified;
        
        _context.Attach(article.Summary);
        _context.Entry(article.Summary).State = EntityState.Modified;
        
        if (article.Summary.Image != null)
        {
            _context.Attach(article.Summary.Image);
            _context.Entry(article.Summary.Image).State = EntityState.Modified;
            _context.Entry(article.Summary.Image).Property(i => i.ParagraphId).IsModified = false;
        }

        /*foreach (var row in article.Summary.Rows)
        {
            _context.Attach(row);
            _context.Entry(row).State = EntityState.Modified;
        }

        foreach (var paragraph in article.Paragraphs)
        {
            _context.Attach(paragraph);
            _context.Entry(paragraph).State = EntityState.Modified;

            foreach (var image in paragraph.Images)
            {
                _context.Attach(image);
                _context.Entry(image).State = EntityState.Modified;
                _context.Entry(image).Property(i => i.SummaryId).IsModified = false;
            }
        }*/
    }

    public async Task<long> GetRandomId()
    {
        Article? article = await _dbSet
            .OrderBy(_ => EF.Functions.Random())
            .FirstOrDefaultAsync();

        return article?.Id ?? -1;
    }

    public async Task<(IEnumerable<Article>, int totalCount)> GetByTitlePaginated(string title, int page, int pageSize)
    {
        var query = _dbSet
            .Where(a => a.Title.ToLower().Contains(title.ToLower()));
        
        var totalCount = await query.CountAsync();
        
        var articles = await query
            .OrderBy(a => a.Id)
            .Include(a => a.Summary)
                .ThenInclude(s => s.Image)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        return (articles, totalCount);
    }
    
}