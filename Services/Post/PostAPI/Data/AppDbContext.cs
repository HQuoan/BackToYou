using System.Text.Json;

namespace PostAPI.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<PostSetting> PostSettings { get; set; }
    public DbSet<PostImage> PostImages { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Follower> Followers { get; set; }


    public DbSet<AdministrativeRegion> AdministrativeRegions { get; set; }
    public DbSet<AdministrativeUnit> AdministrativeUnits { get; set; }
    public DbSet<Province> Provinces { get; set; }
    public DbSet<District> Districts { get; set; }
    public DbSet<Ward> Wards { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        builder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        builder.Entity<PostSetting>().HasData(
            new PostSetting { PostSettingId = new Guid("B21957F3-D71B-461C-A82B-C4D60D0E854B"), Name = nameof(SD.PostLabel_Priority_Price), Value = SD.PostLabel_Priority_Price }
         );

        builder.Entity<Post>()
           .HasIndex(c => c.Title);

        builder.Entity<Post>()
           .HasIndex(c => c.Slug)
           .IsUnique();

        builder.Entity<Post>()
           .Property(c => c.Price)
           .HasPrecision(18, 2);

        builder.Entity<Post>().Property(p => p.PostType)
            .HasConversion<string>();

        builder.Entity<Post>().Property(p => p.PostLabel)
            .HasConversion<string>();

        builder.Entity<Post>().Property(p => p.PostStatus)
            .HasConversion<string>();

        builder.Entity<Post>()
            .OwnsOne(p => p.PostContact);

        builder.Entity<Post>()
          .OwnsOne(p => p.Location);


        builder.Entity<Post>()
            .HasOne(p => p.Category)
           .WithMany(c => c.Posts)
           .HasForeignKey(p => p.CategoryId)
           .OnDelete(DeleteBehavior.Restrict); // Cấm xóa Category nếu có Post liên kết

        // Foreign key cho Comment -> Post
        builder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId)
            .OnDelete(DeleteBehavior.Cascade);  // xóa comment khi xóa Post

        // Foreign key cho PostImage -> Post
        builder.Entity<PostImage>()
            .HasOne(pi => pi.Post)
            .WithMany(p => p.PostImages)
            .HasForeignKey(pi => pi.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        // Foreign key cho Follower -> Post
        builder.Entity<Follower>()
            .HasOne(pi => pi.Post)
            .WithMany(p => p.Followers)
            .HasForeignKey(pi => pi.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed to Categories
        //string categoriesJson = System.IO.File.ReadAllText("Data/SeedData/categories.json");
        //List<Category> categories = System.Text.Json.JsonSerializer.Deserialize<List<Category>>(categoriesJson);
        //builder.Entity<Category>().HasData(categories.ToArray());
    }

    public async Task SeedDataAsync()
    {
        await SeedEntityAsync<Category>("Data/SeedData/categories.json", Categories);
        await SeedEntityAsync<Post>("Data/SeedData/posts.json", Posts);
        await SeedEntityAsync<Post>("Data/SeedData/posts_found.json", Posts);
        //await SeedEntityAsync<PostImage>("Data/SeedData/postimages.json", PostImages);
    }

    private async Task SeedEntityAsync<TEntity>(string filePath, DbSet<TEntity> dbSet) where TEntity : class
    {
        if (File.Exists(filePath))
        {
            string json = await File.ReadAllTextAsync(filePath);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            options.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());

            List<TEntity> entities = JsonSerializer.Deserialize<List<TEntity>>(json, options);

            if (entities != null && entities.Count > 0)
            {
                using (var transaction = await Database.BeginTransactionAsync())
                {
                    try
                    {
                        await dbSet.AddRangeAsync(entities);
                        await SaveChangesAsync();
                        await transaction.CommitAsync();
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        throw new Exception($"Error seeding data: {ex.Message}", ex);
                    }
                }
            }
        }
    }

}
