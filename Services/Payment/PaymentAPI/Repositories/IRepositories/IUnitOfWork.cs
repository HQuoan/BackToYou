namespace PaymentAPI.Repositories.IRepositories;

public interface IUnitOfWork
{
    IReceiptRepository Receipt { get; }
    IWalletRepository Wallet { get; }
    Task SaveAsync();
}
