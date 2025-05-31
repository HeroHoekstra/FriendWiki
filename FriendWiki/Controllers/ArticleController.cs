using FriendWiki.Models;
using FriendWiki.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FriendWiki.Controllers;

[Route("article")]
public class ArticleController : Controller
{
    private readonly ILogger<ArticleController> _logger;
    
    private readonly IArticleRepository _articleRepo;

    public ArticleController(ILogger<ArticleController> logger, IArticleRepository articleRepo)
    {
        _logger = logger;
        _articleRepo = articleRepo;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Article([FromRoute] string id)
    {
        Article? article = await _articleRepo.GetById((long)Convert.ToDouble(id));

        if (article == null)
        {
            return NotFound();
        }
        
        return View(article);
    }
    

    [HttpGet("search")]
    public async Task<IActionResult> Search(string query, int page = 1)
    {
        ViewData["Articles"] = await _articleRepo.GetByTitlePaginated(query, page, 15);
        ViewData["Title"] = query;
        
        return View("Search");
    }
    
    
    [HttpGet("creator")]
    public IActionResult Creator()
    {
        return View("Creator");
    }

    [HttpPost("creator")]
    public async Task<IActionResult> Creator([FromBody] Article? article)
    {
        if (article == null)
        {
            return BadRequest();
        }

        // While `article` is technically correct, images are missing Ids
        // Add Paragraph to Paragraphs's Images
        foreach (var paragraph in article.Paragraphs)
        {
            foreach (var image in paragraph.Images)
            {
                image.Paragraph = paragraph;
                image.ParagraphId = paragraph.Id;
            }
        }
        
        Image? summaryImage = article.Summary.Image;
        if (summaryImage != null)
        {
            article.Summary.ImageId = summaryImage.Id;
            
            summaryImage.Summary = article.Summary;
            summaryImage.SummaryId = article.SummaryId;
        }
        
        article.Sanitize();
        
        await _articleRepo.Create(article);
        await _articleRepo.Save();
        
        return Json(new { id = article.Id });
    }
}