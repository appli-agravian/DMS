//var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddControllersWithViews();

//// REQUIRED for Session to work
//builder.Services.AddDistributedMemoryCache();

//builder.Services.AddSession(options =>
//{
//    options.IdleTimeout = TimeSpan.FromHours(8);
//    options.Cookie.HttpOnly = true;
//    options.Cookie.IsEssential = true;
//});

//// HttpClient to call DMS_API
//builder.Services.AddHttpClient("DmsApi", client =>
//{
//    client.BaseAddress = new Uri("http://apbiphbpsts01:2091/api/");
//});

//var app = builder.Build();

//if (!app.Environment.IsDevelopment())
//{
//    app.UseExceptionHandler("/Home/Error");
//    app.UseHsts();
//}

//app.UseHttpsRedirection();
//app.UseStaticFiles();
//app.UseRouting();
//app.UseSession();        // must be before UseAuthorization
//app.UseAuthorization();

//// AutoLogin is now the entry point
//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller=Account}/{action=AutoLogin}/{id?}");

//app.Run();

//LOCALHOST

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

// HttpClient to call DMS_API
builder.Services.AddHttpClient("DmsApi", client =>
{
    client.BaseAddress = new Uri("https://localhost:7291/");
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Back to Home/Index as entry point
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();