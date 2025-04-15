using Microsoft.EntityFrameworkCore;

namespace PostAPI.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<PostImage> PostImages { get; set; }
    public DbSet<Comment> Comments { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        builder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        builder.Entity<Post>()
           .HasIndex(c => c.Title)
           .IsUnique();

        builder.Entity<Post>().Property(p => p.PostType)
            .HasConversion<string>();

        builder.Entity<Post>().Property(p => p.PostLabel)
            .HasConversion<string>();

        builder.Entity<Post>().Property(p => p.PostStatus)
            .HasConversion<string>();

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
            .OnDelete(DeleteBehavior.Cascade);  // Tương tự, xóa comment khi xóa Post

        // Foreign key cho PostImage -> Post
        builder.Entity<PostImage>()
            .HasOne(pi => pi.Post)
            .WithMany(p => p.PostImages)
            .HasForeignKey(pi => pi.PostId)
            .OnDelete(DeleteBehavior.Cascade);


    }
}
