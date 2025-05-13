namespace WikiFriends.Models;

public class Paragraph : IEntity
{
    public long Id { get; set; }
    
    public int Location { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }

    public ICollection<Image> Images { get; set; } = new List<Image>();
    
    public long ArticleId { get; set; }
    public Article Article { get; set; }
}