namespace PaymentAPI.Repositories;

public class WalletRepository : Repository<Wallet>, IWalletRepository
{
    public WalletRepository(AppDbContext db) : base(db)
    {
    }
}
