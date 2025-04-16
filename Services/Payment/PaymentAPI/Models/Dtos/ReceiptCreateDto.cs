using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PaymentAPI.Models.Dtos;

public class ReceiptCreateDto
{
    [DefaultValue(10000)]
    [Range(0, double.MaxValue, ErrorMessage = "Amount cannot be negative.")]
    public decimal Amount { get; set; }
    [DefaultValue("STRIPE")]
    public string PaymentMethod { get; set; }
}
