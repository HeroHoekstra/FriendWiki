using FriendWiki.Models;
using Microsoft.EntityFrameworkCore;

namespace FriendWiki.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    
    public DbSet<Article> Articles { get; set; }
    public DbSet<Paragraph> Paragraphs { get; set; }
    public DbSet<Summary> Summaries { get; set; }
    public DbSet<SummaryRow> SummaryRows { get; set; }
    public DbSet<Image> Images { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Summary>()
            .HasOne(s => s.Image)
            .WithOne(i => i.Summary)
            .HasForeignKey<Image>(i => i.SummaryId)
            .IsRequired(false);
        
        modelBuilder.Entity<Image>()
            .HasIndex(i => i.SummaryId)
            .IsUnique();
        
        modelBuilder.Entity<Paragraph>()
            .HasMany(p => p.Images)
            .WithOne(i => i.Paragraph)
            .HasForeignKey(p => p.ParagraphId)
            .IsRequired(false);
    }
}