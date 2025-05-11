namespace WikiFriends.Models.Article;

public class Article : IModel
{
    public long Id { get; set; }
    
    public string Title { get; set; }
    public string Lead { get; set; }
}