namespace WikiFriends.Models;

public class Image : IEntity
{
    public long Id { get; set; }
    
    public string Title { get; set; }
    public string Alt { get; set; }
    
    public bool IsLocal { get; set; }
    public string? Url { get; set; }
    
    public long? ParagraphId { get; set; }
    public Paragraph? Paragraph { get; set; }
    
    public long? SummaryId { get; set; }
    public Summary? Summary { get; set; }
}