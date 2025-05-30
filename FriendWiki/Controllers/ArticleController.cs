using System.Text.Json;
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
        
        /*Console.WriteLine(article.Title);
        Console.WriteLine(article.Lead);

        foreach (var item in article.Paragraphs)
        {
            Console.WriteLine(item.Title);
            Console.WriteLine(item.Body);
            foreach (var iitem in item.Images)
            {
                Console.WriteLine(iitem.Source);
                Console.WriteLine(iitem.Alternative);
            }
        }

        Console.WriteLine(article.Summary.Title);
        Console.WriteLine(article.Summary.Image.Source);
        Console.WriteLine(article.Summary.Image.Alternative);

        foreach (var item in article.Summary.Rows)
        {
            Console.WriteLine(item.Title);
            Console.WriteLine(item.Content);
        }*/
        
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
        
        // And add SummaryId to the Summary's Image
        Image? summaryImage = article.Summary.Image;
        if (summaryImage != null)
        {
            article.Summary.ImageId = summaryImage.Id;
            
            summaryImage.Summary = article.Summary;
            summaryImage.SummaryId = article.SummaryId;
        }
        
        await _articleRepo.Create(article);
        await _articleRepo.Save();
        
        return View("Article");
    }
}