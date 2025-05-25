using Microsoft.AspNetCore.Mvc;

namespace FriendWiki.Controllers;

[Route("article")]
public class ArticleController : Controller
{
    private readonly ILogger<ArticleController> _logger;

    public ArticleController(ILogger<ArticleController> logger)
    {
        _logger = logger;
    }


    [HttpGet("creator")]
    public IActionResult Creator()
    {
        return View("Creator");
    }
}