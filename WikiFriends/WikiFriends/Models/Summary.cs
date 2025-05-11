namespace WikiFriends.Models;

public class Summary : IEntity
{
    public long Id { get; set; }
    
    public string Title { get; set; }
    public string Lead { get; set; }
    
    public Image Image { get; set; }
}