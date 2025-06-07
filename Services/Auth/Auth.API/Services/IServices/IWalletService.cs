namespace Auth.API.Services.IServices;

public interface IWalletService
{
    Task<List<WalletDto>> GetWallets(List<Guid> userIds);
}