using Microsoft.EntityFrameworkCore;
using PaymentAPI.Models;
using System.Reflection.Emit;

namespace PaymentAPI.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<Receipt> Receipts { get; set; }
    public DbSet<Wallet> Wallets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Receipt>()
       .Property(r => r.Amount)
       .HasPrecision(18, 2); // 18 chữ số, 2 số sau dấu phẩy

        modelBuilder.Entity<Wallet>()
            .Property(w => w.Balance)
            .HasPrecision(18, 2);

    }
}
