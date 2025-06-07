namespace FriendWiki.Models;

public class SummaryRow : IModel
{
    public long Id { get; set; }
    
    public bool? Deleted { get; set; }
    
    public string Title { get; set; }
    public string Content { get; set; }
    
    public int Position { get; set; }
    
    public long SummaryId { get; set; }
    public Summary Summary { get; set; }
}