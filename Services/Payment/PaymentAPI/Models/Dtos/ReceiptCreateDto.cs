using System.ComponentModel;

namespace PaymentAPI.Models.Dtos;

public class ReceiptCreateDto
{
    [DefaultValue(10000)]
    //[Range(0, double.MaxValue, ErrorMessage = "Amount cannot be negative.")]
    public decimal Amount { get; set; }
    [DefaultValue("STRIPE")]
    public string PaymentMethod { get; set; } = SD.PaymentWithStripe;
}
public class ReceiptCreateDtoValidator : AbstractValidator<ReceiptCreateDto>
{
    public ReceiptCreateDtoValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Amount must be greater than 0.");

    }
}

