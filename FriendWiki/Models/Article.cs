namespace FriendWiki.Models;

public class Article : IModel
{
    public long Id { get; set; }
    
    public string Title { get; set; }
    public string Lead { get; set; }
    
    public long SummaryId { get; set; }
    public Summary Summary { get; set; }
    
    public ICollection<Paragraph> Paragraphs { get; set; }
}