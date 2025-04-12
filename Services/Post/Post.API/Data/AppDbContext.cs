namespace Post.API.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<Category> Categories { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Category>()
         .HasIndex(c => c.Slug)
         .IsUnique();

        builder.Entity<Category>()
       .HasIndex(c => c.Name)
       .IsUnique();
    }
}
