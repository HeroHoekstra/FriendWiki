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
    
    [HttpGet("creator")]
    public IActionResult Create()
    {
        return View("Creator");
    }
}