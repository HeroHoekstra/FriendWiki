using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WikiFriends.Models;
using WikiFriends.Repository;
using WikiFriends.Repository.Interface;

namespace WikiFriends.Controllers;

[Route("/article")]
public class ArticleController : Controller
{
    private readonly IArticleRepository _articleRepo;

    public ArticleController(IArticleRepository articleRepo)
    {
        _articleRepo = articleRepo;
    }
    
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        List<Article> articles = await _articleRepo.GetAll();
        ViewData["Articles"] = articles;
        
        return View();
    }

    #region Fetching Articles
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetArticle([FromRoute] int id)
    {
        Article? article = await _articleRepo.GetById(id);
        if (article == null)
        {
            return NotFound();
        }
        
        ViewData["Article"] = article;
        
        Console.WriteLine(article.Paragraphs.Count);

        foreach (var p in article.Paragraphs)
        {
            Console.WriteLine(p);
        }
        return View("Article");
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(string query)
    {
        var articles = await _articleRepo.GetArticlesByTitle(query);
        ViewData["Articles"] = articles;
        
        return View("Index");
    }

    [HttpGet("random")]
    public async Task<IActionResult> Random()
    {
        ViewData["Article"] = await _articleRepo.GetRandomArticle();
        return View("Article");
    }

    #endregion
    
    #region Article Editing
    
    [HttpGet("creator")]
    public IActionResult CreatePage()
    {
        return View("Creator");
    }

    [HttpPost("creator/create")]
    public async Task<IActionResult> Create(
        [FromForm] string title, [FromForm] string lead,
        [FromForm] List<string> p_title, [FromForm] List<string> p_body)
    {
        if (p_title.Count != p_body.Count)
        {
            return BadRequest("Mismatch number of fields");
        }
        
        // Create main Article
        Article article = new()
        {
            Title = title,
            Lead = lead
        };

        for (int i = 0; i < p_body.Count; i++) // This is assuming that p_title and p_body are in the same order
        {
            Paragraph current = new()
            {
                Location = i,
                Title = p_title[i],
                Body = p_body[i],
                Article = article
            };
            article.Paragraphs.Add(current);
        }

        try
        {
            await _articleRepo.Add(article);
            await _articleRepo.SaveChanges();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Something went wrong:\n{ex.Message}");
            return BadRequest($"Something went wrong trying to upload article:\n{ex.Message}");
        }
        
        return Json(new { success = true, articleId = article.Id });
    }
    
    #endregion
}