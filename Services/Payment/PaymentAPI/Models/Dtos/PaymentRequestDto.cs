using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace PaymentAPI.Models.Dtos;

public class PaymentRequestDto
{
    [Required]
    public Guid ReceiptId { get; set; }
    public string? PaymentSessionUrl { get; set; }
    [DefaultValue("https://drive.google.com/file/d/1BjNcczy3hcsiLWNdzywwM8ay30MLJdyR/view?usp=sharing")]
    public string ApprovedUrl { get; set; }

    [DefaultValue("https://drive.google.com/file/d/1BjNcczy3hcsiLWNdzywwM8ay30MLJdyR/view?usp=sharing")]
    public string CancelUrl { get; set; }
}
