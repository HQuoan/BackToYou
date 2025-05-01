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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        builder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        builder.Entity<Category>().HasData(
            new Category
            {
                CategoryId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Giấy tờ tùy thân",
                Slug = "giay-to-tuy-than"
            },
            new Category
            {
                CategoryId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Người thân",
                Slug = "nguoi-than"
            },
            new Category
            {
                CategoryId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Thú cưng",
                Slug = "thu-cung"
            },
            new Category
            {
                CategoryId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "Trang sức",
                Slug = "trang-suc"
            },
            new Category
            {
                CategoryId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Thiết bị điện tử",
                Slug = "thiet-bi-dien-tu"
            },
            new Category
            {
                CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Name = "Xe cộ",
                Slug = "xe-co"
            },
            new Category
            {
                CategoryId = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                Name = "Khác",
                Slug = "khac"
            }
        );

        builder.Entity<PostSetting>().HasData(
            new PostSetting { PostSettingId = new Guid("B21957F3-D71B-461C-A82B-C4D60D0E854B"), Name = nameof(SD.PostLabel_Priority_Price), Value = SD.PostLabel_Priority_Price }
         );

        builder.Entity<Post>()
           .HasIndex(c => c.Title)
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
            .OwnsOne(p => p.Location);

        builder.Entity<Post>()
        .OwnsOne(p => p.PostContact);

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


    }
}
