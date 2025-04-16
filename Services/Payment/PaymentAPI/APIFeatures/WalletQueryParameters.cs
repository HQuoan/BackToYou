namespace PaymentAPI.APIFeatures;

public class WalletQueryParameters : BaseQueryParameters
{
    public Guid? UserId { get; set; }
    public decimal? Balance { get; set; }
}
