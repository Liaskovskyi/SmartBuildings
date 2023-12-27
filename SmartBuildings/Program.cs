using Microsoft.EntityFrameworkCore;
using SmartBuildings.Models;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();



if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("ReactPolicy");
app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "auth",
    pattern: "auth/{controller=Auth}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "apartment",
    pattern: "apartment/{controller=Apartment}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "devices",
    pattern: "devices/{controller=Devices}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "meters",
    pattern: "meters/{controller=Meters}/{action=Index}/{id?}");


app.Run();
