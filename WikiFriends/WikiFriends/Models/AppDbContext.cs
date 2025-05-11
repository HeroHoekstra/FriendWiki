using DotNetEnv;

namespace WikiFriends.Models;

using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    // Here go all models like so:
    // public DbSet<Model> Models {get; set;}

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    
}