namespace PaymentAPI.Models.Dtos;

public class RefundDto
{
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
}
