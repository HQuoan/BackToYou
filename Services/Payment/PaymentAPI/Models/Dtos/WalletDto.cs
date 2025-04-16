using System.ComponentModel.DataAnnotations;

namespace PaymentAPI.Models.Dtos;

public class WalletDto
{
    public Guid WalletId { get; set; }
    public Guid UserId { get; set; }
    [Range(0, double.MaxValue, ErrorMessage = "Balance cannot be negative.")]
    public decimal Balance { get; set; }
}
