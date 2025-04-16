namespace PaymentAPI.Repositories;

public class ReceiptRepository : Repository<Receipt>, IReceiptRepository
{
    public ReceiptRepository(AppDbContext db) : base(db)
    {
    }
}
