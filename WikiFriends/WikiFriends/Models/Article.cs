using System.ComponentModel.DataAnnotations;

namespace WikiFriends.Models;

public class Article : IEntity
{
    public long Id { get; set; }
    
    public string Title { get; set; }
    public string Lead { get; set; }
    
    public ICollection<Paragraph> Paragraphs { get; set; } = new List<Paragraph>();
}