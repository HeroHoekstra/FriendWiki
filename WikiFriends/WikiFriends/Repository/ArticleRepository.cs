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
}