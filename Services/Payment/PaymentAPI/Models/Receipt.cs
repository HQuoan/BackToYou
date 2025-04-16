using System.ComponentModel.DataAnnotations;

namespace PaymentAPI.Models;

public class Receipt : BaseEntity
{
    [Key]
    public Guid ReceiptId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public string Email { get; set; }
    [Range(0, double.MaxValue, ErrorMessage = "Amount cannot be negative.")]
    public decimal Amount { get; set; }

    public string? Status { get; set; }
    public string? PaymentIntentId { get; set; }
    public string? StripeSessionId { get; set; }
    public string PaymentMethod { get; set; } = SD.PaymentWithStripe;
    public string? PaymentSessionUrl { get; set; }
}
