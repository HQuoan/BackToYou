namespace PaymentAPI.APIFeatures;

public class ReceiptQueryParameters : BaseQueryParameters
{
    public Guid? UserId { get; set; }
    public string? Email { get; set; }
    public decimal? Amount { get; set; }
    public string? Status { get; set; }
    public DateTime? CreateAt { get; set; }
}
