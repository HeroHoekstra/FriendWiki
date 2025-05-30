using dotenv.net;
using FriendWiki.Data;
using FriendWiki.Repository;
using FriendWiki.Repository.Interface;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

DotEnv.Load();

// Load the connection string for the database
var connectionString = $"server={Environment.GetEnvironmentVariable("DB_HOST")};" +
                       $"port={Environment.GetEnvironmentVariable("DB_PORT")};" +
                       $"database={Environment.GetEnvironmentVariable("DB_NAME")};" +
                       $"user={Environment.GetEnvironmentVariable("DB_USER")};" +
                       $"password={Environment.GetEnvironmentVariable("DB_PASSWORD")};";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString));

// Adding Singletons
// Repositories
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();