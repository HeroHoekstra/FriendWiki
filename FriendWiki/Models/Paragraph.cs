namespace FriendWiki.Models;

public class Paragraph : IModel
{
    public long Id { get; set; }
    
    public string Title { get; set; }
    public string Body { get; set; }

    public ICollection<Image> Images { get; set; } = new List<Image>();
}