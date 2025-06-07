namespace FriendWiki.Models;

public interface IModel
{
    long Id { get; set; }
    
    bool? Deleted { get; set; }
}