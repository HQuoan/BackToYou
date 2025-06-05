using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.OpenApi.Models;
using NotificationAPI;
using NotificationAPI.Repositories;
using System.Reflection;
using BuildingBlocks.Messaging.MassTransit;
using NotificationAPI.Hubs;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
builder.Services.AddDbContext<AppDbContext>((sp, options) =>
{
    options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// AutoMapper
IMapper mapper = MappingConfig.RegisterMaps().CreateMapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());



// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Notification Management API",
        Version = "v1",
        Contact = new OpenApiContact
        {
            Name = "Support Team",
            Email = "vuongvodtan@gmail.com",
            Url = new Uri("https://cineworld.io.vn")
        },
    });

    // JWT Bearer Authorization
    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter the Bearer Authorization string as: `Bearer Generated-JWT-Token`",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                }
            }, new string[]{ }
        }
    });

    // XML Documentation
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<BackendApiAuthenticationHttpClientHandler>();

// Authentication & Authorization
builder.AddAppAuthentication();
builder.Services.AddAuthorization();

// Exception Handler
builder.Services.AddExceptionHandler<CustomExceptionHandler>();

builder.Services.AddSingleton<IUserIdProvider, NameUserIdProvider>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

//Async Communication Services
builder.Services.AddMessageBroker(builder.Configuration, Assembly.GetExecutingAssembly());

builder.Services.AddSignalR();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
          policy =>
          {
              policy.SetIsOriginAllowed(_ => true) // Cho phép tất cả các origin
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
          });
});

var app = builder.Build();

// --- Middleware Configuration ---

// Request Logging
app.UseMiddleware<RequestLoggingMiddleware>();

// Apply Migrations
ApplyMigration();

// Apply CORS Policy
app.UseCors("AllowAllOrigins");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<NotificationHub>("/hubs/notification");


app.UseExceptionHandler(options => { });

app.Run();


// Apply migrations
void ApplyMigration()
{
    using (var scope = app.Services.CreateScope())
    {
        var _db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        if (_db.Database.GetPendingMigrations().Any())
        {
            _db.Database.Migrate();
        }
    }
}

