namespace PaymentAPI.Exceptions;

public class WalletNotFoundException : NotFoundException
{
    public WalletNotFoundException(object key) : base("Wallet", key)
    {
    }
}