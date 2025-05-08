using Microsoft.AspNetCore.Mvc;

namespace WikiFriends.Controllers;

[Route("/article")]
public class ArticleController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
}