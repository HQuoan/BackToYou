using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text.Json.Serialization;
using ImageService;
using FluentValidation.AspNetCore;
using BuildingBlocks.Messaging.MassTransit;

var builder = WebApplication.CreateBuilder(args);

// --- Configure Services ---

// DbContext & Interceptors
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

// Controllers & FluentValidation
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
})
.ConfigureApiBehaviorOptions(options =>
{
    options.SuppressModelStateInvalidFilter = true; // Tắt validation mặc định của ASP.NET Core
});

builder.Services.AddFluentValidationAutoValidation(fv =>
{
    fv.DisableDataAnnotationsValidation = true; // Tắt validation từ DataAnnotations
})
.AddFluentValidationClientsideAdapters();

// Add Validators from Assembly
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Swagger & API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Post Management API",
        Version = "v1",
        Description = "",
        Contact = new OpenApiContact
        {
            Name = "Support Team",
            Email = "vuongvodtan@gmail.com",
            Url = new Uri("https://cineworld.io.vn")
        },
    });

    // JWT Authentication
    options.AddSecurityDefinition(name: JwtBearerDefaults.AuthenticationScheme, securityScheme: new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter the Bearer Authorization string as following: `Bearer Generated-JWT-Token`",
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

// HttpContext & HTTP Client
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<BackendApiAuthenticationHttpClientHandler>();

// Authentication & Authorization
builder.AddAppAuthentication();
builder.Services.AddAuthorization();

// Exception Handling
builder.Services.AddExceptionHandler<CustomExceptionHandler>();



// Application Services
//builder.Services.AddScoped<ITranslateService, TranslateService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IImageUploader, CloudinaryUploader>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAIService, AIService>();

builder.Services.AddHostedService<PriorityDowngradeService>();



//builder.Services.Configure<LibreTranslateOptions>(
//    builder.Configuration.GetSection("LibreTranslate"));


// HttpClient Configuration for External Services
builder.Services.AddHttpClient(SD.HttpClient_Payment, u => u.BaseAddress = new Uri(builder.Configuration["ServiceUrls:PaymentAPI"])).AddHttpMessageHandler<BackendApiAuthenticationHttpClientHandler>();

builder.Services.AddHttpClient(SD.HttpClient_User, u => u.BaseAddress = new Uri(builder.Configuration["ServiceUrls:AuthAPI"])).AddHttpMessageHandler<BackendApiAuthenticationHttpClientHandler>();

builder.Services.AddHttpClient(SD.HttpClient_AI, u => u.BaseAddress = new Uri(builder.Configuration["ServiceUrls:AiAPI"]));

//builder.Services.Configure<ServiceUrls>(builder.Configuration.GetSection("ServiceUrls"));


//Async Communication Services
builder.Services.AddMessageBroker(builder.Configuration);

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

// HTTP Request Pipeline Configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseForwardedHeaders(new ForwardedHeadersOptions
//{
//    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
//});

//app.UseHttpsRedirection();  // bỏ, nó sẽ trả làm sai reverse proxy vì nó bắt client request http , request lại bằng https và làm lộ server

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Global Exception Handler
app.UseExceptionHandler(options => { });

app.Run();

// Migration Helper
void ApplyMigration()
{
    using (var scope = app.Services.CreateScope())
    {
        var _db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        if (_db.Database.GetPendingMigrations().Count() > 0)
        {
            _db.Database.Migrate();
        }

        // Kiểm tra xem đã có dữ liệu trong bảng hay chưa
        if (!_db.Posts.Any())
        {
            _db.SeedDataAsync().Wait();
        }

        if (!_db.AdministrativeRegions.Any()) 
        {

            //var basePath = AppContext.BaseDirectory;
            //var sqlFilePath = Path.Combine(basePath, "Data", "SeedData", "ImportData_vn_units.sql");

            var sqlFilePath = "Data/SeedData/ImportData_vn_units.sql";
            //var sqlFilePath = "Data/SeedData/test.sql";

            if (File.Exists(sqlFilePath))
            {
                var sqlScript = File.ReadAllText(sqlFilePath);
                _db.Database.ExecuteSqlRaw(sqlScript);
            }
            else
            {
                Console.WriteLine("Không tìm thấy file ImportData_vn_units.sql.");
                Console.WriteLine(sqlFilePath);
            }
        }
    }
}
