namespace PaymentAPI.Models.Dtos;

public class ReceiptDto: BaseEntity
{
    public Guid ReceiptId { get; set; }
    public Guid UserId { get; set; }
    public string Email { get; set; }
    public decimal Amount { get; set; }
    public string? Status { get; set; }
    public string? PaymentIntentId { get; set; }
    public string? StripeSessionId { get; set; }
    public string PaymentMethod { get; set; } = SD.PaymentWithStripe;
    public string? PaymentSessionUrl { get; set; }
}
