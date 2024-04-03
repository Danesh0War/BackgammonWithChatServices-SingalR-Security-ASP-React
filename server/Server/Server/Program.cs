using DAL.Database;
using DAL.Interfaces;
using DAL.Repositories;
using Logic.Interfaces;
using Logic.Services;
using Models.Models;
using Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Registering services for SignalR
builder.Services.AddSignalR(e =>
{
    e.MaximumReceiveMessageSize = 102400000;
    e.EnableDetailedErrors = false;
});

// Retrieving MongoDB settings from configuration
var mongoDbSettings = builder.Configuration.GetSection("DatabaseSettings");
var databaseName = mongoDbSettings.GetValue<string>("DatabaseName");
var connectionString = mongoDbSettings.GetValue<string>("ConnectionString");

// Registering MongoDBConnector with the DI container
builder.Services.AddSingleton<MongoDBConnector>(sp => new MongoDBConnector(connectionString, databaseName));

// Registering User and Chat repositories with the DI container using factory delegates
builder.Services.AddSingleton<IUserRepository>(serviceProvider =>
{
    var dbConnector = serviceProvider.GetRequiredService<MongoDBConnector>();
    return new UserRepository(dbConnector, "Users");
});

builder.Services.AddSingleton<IChatRepository>(serviceProvider =>
{
    var dbConnector = serviceProvider.GetRequiredService<MongoDBConnector>();
    return new ChatRepository(dbConnector, "Chats");
});

// Registering other services
builder.Services.AddSingleton<IDictionary<string, User>>(options => new Dictionary<string, User>());
builder.Services.AddSingleton<IUserService, UserService>();
builder.Services.AddSingleton<IChatService, ChatService>();

// Configuring CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
    });
});

var app = builder.Build();

// Middleware configurations
app.UseRouting();
app.UseCors();

// Configuring endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<MainHub>("/main");
});

app.Run();
