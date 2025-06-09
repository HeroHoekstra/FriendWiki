using System.Text.Json;
using System.Text.Json.Serialization;
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

    /*public new void Update(Article article)
    {
        /*_context.Attach(article);
        _context.Entry(article).State = EntityState.Modified;
        
        _context.Attach(article.Summary);
        _context.Entry(article.Summary).State = EntityState.Modified;
        
        if (article.Summary.Image != null)
        {
            _context.Attach(article.Summary.Image);
            _context.Entry(article.Summary.Image).State = EntityState.Modified;
            _context.Entry(article.Summary.Image).Property(i => i.ParagraphId).IsModified = false;
        }

        foreach (var row in article.Summary.Rows)
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
        }
    }*/

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

    public new async Task Update(Article newArticle)
    {
        Article? oldArticle = await GetById(newArticle.Id);
        if (oldArticle == null)
        {
            throw new KeyNotFoundException($"Article with id {newArticle.Id} not found");
        }
    
        newArticle.SummaryId = oldArticle.SummaryId;
        newArticle.Summary.Id = oldArticle.Summary.Id;

        foreach (var row in newArticle.Summary.Rows)
        {
            row.SummaryId = oldArticle.Summary.Id;
        }
    
        foreach (var paragraph in newArticle.Paragraphs)
        {
            paragraph.ArticleId = newArticle.Id;
            foreach (var image in paragraph.Images)
            {
                // Ensure navigation properties are set for proper FK assignment
                image.Paragraph = paragraph;
                image.ParagraphId = paragraph.Id; // Explicitly set FK
            }
        }

        // Detach old entities to prevent tracking conflicts
        _context.Entry(oldArticle).State = EntityState.Detached;
        _context.Entry(oldArticle.Summary).State = EntityState.Detached;
        DetachEntities(oldArticle.Summary.Rows);
        DetachEntities(oldArticle.Paragraphs);
        foreach (var paragraph in oldArticle.Paragraphs)
        {
            DetachEntities(paragraph.Images);
        }

        // Attach and update the new entity graph
        _context.Update(newArticle);

        // Explicitly mark new images as 'Added'
        foreach (var paragraph in newArticle.Paragraphs)
        {
            foreach (var image in paragraph.Images)
            {
                if (image.Id == 0) // New image
                {
                    _context.Entry(image).State = EntityState.Added;
                }
            }
        }
        
        var debug = _context.ChangeTracker.DebugView.LongView;
        Console.WriteLine(debug);
    }

    private void DetachEntities<T>(IEnumerable<T> entities) where T : class, IModel
    {
        foreach (var entity in entities)
        {
            _context.Entry(entity).State = EntityState.Detached;
        }
    }
    
}