namespace FriendWiki.Models;

public class Image : IModel
{
    public long Id { get; set; }
    
    public string Source { get; set; }
    public string Alternative { get; set; }
    
    public long? SummaryId { get; set; }
    public Summary? Summary { get; set; }
    
    public long? ParagraphId { get; set; }
    public Paragraph? Paragraph { get; set; }
}