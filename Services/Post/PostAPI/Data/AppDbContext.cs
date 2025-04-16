using Microsoft.EntityFrameworkCore;

namespace PostAPI.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<PostLabel> PostLabels { get; set; }
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

        builder.Entity<PostLabel>()
             .Property(p => p.Price)
             .HasPrecision(18, 2); // 18 chữ số, 2 số sau dấu phẩy

        builder.Entity<PostLabel>().HasData(
            new PostLabel { PostLabelId = new Guid(SD.PostLabel_Normal_Id), Name = "Normal" },
            new PostLabel { PostLabelId = new Guid(SD.PostLabel_Priority_Id), Name = "Priority" , Price = 10000},
            new PostLabel { PostLabelId = new Guid("F08CA90E-390B-4B22-92D6-0865E1FB9023"), Name = "Found" },
            new PostLabel { PostLabelId = new Guid("B21957F3-D71B-461C-A82B-C4D60D0E854B"), Name = "Fake" }
         );

        builder.Entity<Post>()
           .HasIndex(c => c.Title)
           .IsUnique();

        builder.Entity<Post>().Property(p => p.PostType)
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
