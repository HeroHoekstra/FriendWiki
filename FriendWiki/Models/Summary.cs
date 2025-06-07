using Ganss.Xss;

namespace FriendWiki.Models;

public class Summary : IModel
{
    public long Id { get; set; }
    
    public bool? Deleted { get; set; }
    
    public string Title { get; set; }
    
    public long? ImageId { get; set; }
    public Image? Image { get; set; }

    public ICollection<SummaryRow> Rows { get; set; } = new List<SummaryRow>();
}