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
}