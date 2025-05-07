using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text.Json.Serialization;

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

// Exception Handler
builder.Services.AddExceptionHandler<CustomExceptionHandler>();

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
    options.SuppressModelStateInvalidFilter = true; // Disable default validation
});

// FluentValidation Configuration
builder.Services.AddFluentValidationAutoValidation(fv =>
{
    fv.DisableDataAnnotationsValidation = true; // Disable DataAnnotations validation
})
.AddFluentValidationClientsideAdapters();

// Add Validators from Assembly
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Swagger Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Payment Management API",
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

// Authentication & Authorization
builder.AddAppAuthentication();
builder.Services.AddAuthorization();

// Stripe & PayOS Configuration
Stripe.StripeConfiguration.ApiKey = builder.Configuration.GetSection("Stripe:SecretKey").Get<string>();
builder.Services.Configure<PayOSOptions>(builder.Configuration.GetSection("PayOS"));

// Scoped Services
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IEmailService, EmailService.EmailService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// Payment Methods
builder.Services.AddScoped<IPaymentMethodFactory, PaymentMethodFactory>();
builder.Services.AddScoped<IPaymentMethod, PaymentWithStripe>();
builder.Services.AddScoped<IPaymentMethod, PaymentWithPayOS>();

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

// HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
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
