using System.Text.Json;
using System.Text.Json.Serialization;
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
    
    #region Viewing 

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
    public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (articles, totalCount) = await _articleRepo.GetByTitlePaginated(query, page, pageSize);

        ViewData["Articles"] = articles;
        ViewData["TotalCount"] = totalCount;
        ViewData["PageSize"] = pageSize;
        ViewData["Title"] = query;
        
        return View();
    }

    [HttpGet("random")]
    public async Task<IActionResult> Random()
    {
        long id = await _articleRepo.GetRandomId();

        return RedirectToAction("Article", "Article", new { id });
    }
    
    #endregion
    
    #region Creating
    
    [HttpGet("creator")]
    public IActionResult Creator()
    {
        return View();
    }
    
    [HttpPost("creator")]
    public async Task<IActionResult> Creator([FromBody] Article? article)
    {
        if (article == null)
        {
            return BadRequest();
        }

        // While `article` is technically correct, but images are missing Ids
        int position = 0;
        foreach (var paragraph in article.Paragraphs)
        {
            paragraph.Position = position++;
            
            int imagePosition = 0;
            foreach (var image in paragraph.Images)
            {
                image.Position = imagePosition++;
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

        position = 0;
        foreach (var row in article.Summary.Rows)
        {
            row.Position = position++;
            row.Summary = article.Summary;
            row.SummaryId = article.SummaryId;
        }
        
        article.Sanitize();
        
        await _articleRepo.Create(article);
        await _articleRepo.Save();
        
        return Json(new { id = article.Id });
    }

    #endregion
    
    #region Editing

    [HttpGet("editor/{id}")]
    public async Task<IActionResult> Editor([FromRoute] string id)
    {
        long convertedId = (long)Convert.ToDouble(id);
        
        Article? article = await _articleRepo.GetById(convertedId);
        if (article == null)
        {
            return NotFound();
        }
        
        var options = new JsonSerializerOptions
        {
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            WriteIndented = false
        };
        string articleJson = JsonSerializer.Serialize(article, options);
        ViewData["ArticleJson"] = articleJson.Replace("\u0060", "\\`");

        return View("Creator");
    }

    [HttpPost("editor")]
    public async Task<IActionResult> Editor([FromBody] Article? article)
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
        
        await _articleRepo.Update(article);
        await _articleRepo.Save();
        
        return Json(new { id = article.Id });
    }
    
    #endregion
}