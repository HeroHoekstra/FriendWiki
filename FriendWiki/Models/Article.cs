using Ganss.Xss;

namespace FriendWiki.Models;

public class Article : IModel
{
    private readonly HtmlSanitizer _sanitizer;

    public Article()
    {
        _sanitizer = new HtmlSanitizer();
    }   

    public void Sanitize()
    {
        // Summary
        Summary.Title = _sanitizer.Sanitize(Summary.Title);

        if (Summary.Image != null)
        {
            Summary.Image.Source = _sanitizer.Sanitize(Summary.Image.Source);
            Summary.Image.Alternative = _sanitizer.Sanitize(Summary.Image.Alternative);
        }
        
        foreach (SummaryRow row in Summary.Rows)
        {
            row.Title = _sanitizer.Sanitize(row.Title);
            row.Content = _sanitizer.Sanitize(row.Content);
        }
        
        // Paragraphs
        foreach (Paragraph paragraph in Paragraphs)
        {
            paragraph.Title = _sanitizer.Sanitize(paragraph.Title);
            paragraph.Body = _sanitizer.Sanitize(paragraph.Body);

            foreach (Image image in paragraph.Images)
            {
                image.Source = _sanitizer.Sanitize(image.Source);
                image.Alternative = _sanitizer.Sanitize(image.Alternative);
            }
        }
    }
    
    public long Id { get; set; }
    
    public string Title { get; set; }
    public string Lead { get; set; }
    
    public long SummaryId { get; set; }
    public Summary Summary { get; set; }
    
    public ICollection<Paragraph> Paragraphs { get; set; }
}