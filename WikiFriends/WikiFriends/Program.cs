using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using WikiFriends.Models;
using WikiFriends.Repository;
using WikiFriends.Repository.Interface;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = $"server={Env.GetString("DB_HOST")};" +
                           $"database={Env.GetString("DB_NAME")};" +
                           $"user={Env.GetString("DB_USER")};" +
                           $"password={Env.GetString("DB_PASSWORD")};";
    options.UseMySQL(connectionString);
});

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