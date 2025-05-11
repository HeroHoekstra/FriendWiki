namespace WikiFriends.Models;

using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    // Here go all models like so:
    // public DbSet<Model> Models {get; set;}
    public DbSet<Article> Articles { get; set; }
    public DbSet<Paragraph> Paragraphs { get; set; }
    public DbSet<Summary> Summaries { get; set; }
    public DbSet<Image> Images { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public new void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Summary-Image (one-to-one)
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
            .HasForeignKey(i => i.ParagraphId)
            .IsRequired(false);
    }
    
}