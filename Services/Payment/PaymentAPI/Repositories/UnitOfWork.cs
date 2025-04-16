namespace PaymentAPI.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    public IReceiptRepository Receipt { get; private set; }
    public IWalletRepository Wallet { get; private set; }

    public UnitOfWork(AppDbContext db)
    {
        _db = db;
        Receipt = new ReceiptRepository(_db);
        Wallet = new WalletRepository(_db);
    }
    public async Task SaveAsync()
    {
        await _db.SaveChangesAsync();
    }
}
