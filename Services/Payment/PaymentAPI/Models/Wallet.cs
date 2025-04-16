using System.ComponentModel.DataAnnotations;

namespace PaymentAPI.Models;

public class Wallet : BaseEntity
{
    [Key]
    public Guid WalletId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Range(0, double.MaxValue, ErrorMessage = "Balance cannot be negative.")]
    public decimal Balance { get; set; }

}
